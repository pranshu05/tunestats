"use client"
import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { MessageSquare, ThumbsUp, Reply, Trash2, Send, Loader2 } from "lucide-react"

interface Comment {
    commentId: number
    text: string
    userId: string
    name: string
    timestamp: string
    upvoteCount: number
    parentCommentId?: number | null
    replies?: Comment[]
    hasUserUpvoted?: boolean
}

export default function CommentSection({ entityId, entityType }: { entityId: string; entityType: string }) {
    const { data: session } = useSession()
    const [comments, setComments] = useState<Comment[]>([])
    const [text, setText] = useState("")
    const [replyText, setReplyText] = useState<{ [key: number]: string }>({})
    const [replying, setReplying] = useState<{ [key: number]: boolean }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchComments = useCallback(async () => {
        if (!session?.user?.id) return

        const res = await fetch(`/api/comments?entityId=${entityId}&entityType=${entityType}`)
        const data: Comment[] = await res.json()

        const upvoteStatusRes = await fetch(`/api/comments/upvote-status?userId=${session.user.id}`)
        const upvoteStatus: { commentId: number }[] = await upvoteStatusRes.json()

        const upvotedCommentIds = new Set(upvoteStatus.map((item) => item.commentId))

        data.forEach((comment) => {
            comment.hasUserUpvoted = upvotedCommentIds.has(comment.commentId)
        })

        const commentMap: { [key: number]: Comment } = {}
        const roots: Comment[] = []

        data.forEach((comment) => {
            comment.replies = []
            commentMap[comment.commentId] = comment
        })

        data.forEach((comment) => {
            if (comment.parentCommentId) {
                commentMap[comment.parentCommentId]?.replies?.push(comment)
            } else {
                roots.push(comment)
            }
        })

        setComments(roots)
    }, [entityId, entityType, session])

    const handleSubmit = async () => {
        if (!text.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            await fetch("/api/comments", {
                method: "POST",
                body: JSON.stringify({ text, entityId, entityType }),
            })
            setText("")
            fetchComments()
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReplySubmit = async (parentId: number) => {
        const reply = replyText[parentId]
        if (!reply?.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            await fetch("/api/comments", {
                method: "POST",
                body: JSON.stringify({ text: reply, entityId, entityType, parentCommentId: parentId }),
            })

            setReplyText((prev) => ({ ...prev, [parentId]: "" }))
            setReplying((prev) => ({ ...prev, [parentId]: false }))
            fetchComments()
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (commentId: number) => {
        await fetch(`/api/comments/${commentId}`, { method: "DELETE" })
        fetchComments()
    }

    const handleUpvote = async (commentId: number) => {
        await fetch(`/api/comments/${commentId}/upvote`, {
            method: "POST",
        })

        setComments((prev) => updateCommentUpvoteState(prev, commentId, true))
        fetchComments()
    }

    const handleRemoveUpvote = async (commentId: number) => {
        await fetch(`/api/comments/${commentId}/upvote`, {
            method: "DELETE",
        })

        setComments((prev) => updateCommentUpvoteState(prev, commentId, false))
        fetchComments()
    }

    const updateCommentUpvoteState = (comments: Comment[], targetId: number, upvoted: boolean): Comment[] => {
        return comments.map((comment) => {
            if (comment.commentId === targetId) {
                return {
                    ...comment,
                    hasUserUpvoted: upvoted,
                    upvoteCount: upvoted ? comment.upvoteCount + 1 : comment.upvoteCount - 1,
                    replies: comment.replies ? updateCommentUpvoteState(comment.replies, targetId, upvoted) : [],
                }
            }

            return {
                ...comment,
                replies: comment.replies ? updateCommentUpvoteState(comment.replies, targetId, upvoted) : [],
            }
        })
    }

    const toggleReply = (commentId: number) => {
        setReplying((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }))
    }

    const renderComment = (c: Comment, depth = 0) => (
        <div key={c.commentId} className={`${depth > 0 ? "ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-[#3d2e23]" : ""} py-3`}>
            <div className="flex items-center mb-2">
                <a href={`/user/${c.userId}`} className="font-medium text-[#e6d2c0] hover:underline">{c.name}</a>
                <span className="ml-auto text-xs text-[#a18072]">{new Date(c.timestamp).toLocaleString()}</span>
            </div>
            <p className="text-sm mb-2 bg-[#2a211c] p-2 rounded text-[#e6d2c0]">{c.text}</p>
            <div className="flex flex-wrap items-center text-sm gap-1 lg:gap-4">
                <button onClick={c.hasUserUpvoted ? () => handleRemoveUpvote(c.commentId) : () => handleUpvote(c.commentId)} className={`inline-flex items-center gap-1 ${c.hasUserUpvoted ? "text-[#c38e70]" : "text-[#a18072] hover:text-[#e6d2c0]"}`}><ThumbsUp size={14} fill={c.hasUserUpvoted ? "currentColor" : "none"} /><span>{c.upvoteCount}</span></button>
                <button onClick={() => toggleReply(c.commentId)} className="inline-flex items-center gap-1 text-[#a18072] hover:text-[#e6d2c0]"><Reply size={14} />Reply</button>
                {session?.user?.id === c.userId && (<button onClick={() => handleDelete(c.commentId)} className="inline-flex items-center gap-1 text-red-400 hover:text-red-300"><Trash2 size={14} />Delete</button>)}
            </div>
            {replying[c.commentId] && (
                <div className="mt-2 pl-2 lg:pl-4 border-l border-[#3d2e23]">
                    <div className="flex gap-2">
                        <textarea className="flex-1 bg-[#2a211c] border border-[#3d2e23] p-2 text-sm resize-none rounded focus:outline-none focus:ring-1 focus:ring-[#c38e70] text-[#e6d2c0]" rows={2} placeholder="Write a reply..." value={replyText[c.commentId] || ""} onChange={(e) => setReplyText((prev) => ({ ...prev, [c.commentId]: e.target.value }))} />
                        <button className="px-3 py-1 bg-[#c38e70] text-[#1e1814] font-medium rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handleReplySubmit(c.commentId)} disabled={!replyText[c.commentId]?.trim() || isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}</button>
                    </div>
                </div>
            )}
            <div className="mt-2">{c.replies && c.replies.map((reply) => renderComment(reply, depth + 1))}</div>
        </div>
    )

    useEffect(() => {
        if (session?.user?.id) {
            fetchComments()
        }
    }, [fetchComments, session])

    return (
        <div className="rounded-lg bg-[#1e1814] border border-[#3d2e23] p-3 lg:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
                <MessageSquare className="text-[#c38e70]" />
                <h3 className="text-xl font-bold text-[#e6d2c0]">Comments</h3>
            </div>
            {session?.user?.id ? (
                <div className="mb-2 lg:mb-4">
                    <textarea className="w-full bg-[#2a211c] border border-[#3d2e23] p-4 resize-none mb-3 rounded focus:outline-none focus:ring-1 focus:ring-[#c38e70] text-[#e6d2c0]" placeholder="Write a comment..." rows={3} value={text} onChange={(e) => setText(e.target.value)} />
                    <button onClick={handleSubmit} disabled={!text.trim() || isSubmitting} className="px-4 py-2 bg-[#c38e70] text-[#1e1814] font-medium rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">{isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}Post Comment</button>
                </div>
            ) : (
                <div className="mb-6 p-4 bg-[#2a211c] rounded text-[#a18072]">Sign in to leave a comment</div>
            )}
            {session?.user && (
                <div className="divide-y divide-[#3d2e23]">
                    {comments.length > 0 ? (
                        comments.map((c) => renderComment(c))
                    ) : (
                        <div className="text-[#a18072] p-4 bg-[#2a211c] rounded text-center">No comments yet</div>
                    )}
                </div>
            )}
        </div>
    )
}