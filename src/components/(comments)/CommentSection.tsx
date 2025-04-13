'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Comment {
    commentId: number;
    text: string;
    userId: string;
    name: string;
    image?: string;
    timestamp: string;
    upvoteCount: number;
    parentCommentId?: number | null;
    replies?: Comment[];
    hasUserUpvoted?: boolean;
}

export default function CommentSection({ entityId, entityType }: { entityId: string; entityType: string }) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [text, setText] = useState('');
    const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
    const [replying, setReplying] = useState<{ [key: number]: boolean }>({});

    const fetchComments = useCallback(async () => {
        if (!session?.user?.id) return;

        const res = await fetch(`/api/comments?entityId=${entityId}&entityType=${entityType}`);
        const data: Comment[] = await res.json();

        const upvoteStatusRes = await fetch(`/api/comments/upvote-status?userId=${session.user.id}`);
        const upvoteStatus: { commentId: number }[] = await upvoteStatusRes.json();

        const upvotedCommentIds = new Set(upvoteStatus.map(item => item.commentId));

        data.forEach(comment => {
            comment.hasUserUpvoted = upvotedCommentIds.has(comment.commentId);
        });

        const commentMap: { [key: number]: Comment } = {};
        const roots: Comment[] = [];

        data.forEach((comment) => {
            comment.replies = [];
            commentMap[comment.commentId] = comment;
        });

        data.forEach((comment) => {
            if (comment.parentCommentId) {
                commentMap[comment.parentCommentId]?.replies?.push(comment);
            } else {
                roots.push(comment);
            }
        });

        setComments(roots);
    }, [entityId, entityType, session]);

    const handleSubmit = async () => {
        if (!text.trim()) return;

        await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({ text, entityId, entityType }),
        });
        setText('');
        fetchComments();
    };

    const handleReplySubmit = async (parentId: number) => {
        const reply = replyText[parentId];
        if (!reply?.trim()) return;

        await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({ text: reply, entityId, entityType, parentCommentId: parentId }),
        });

        setReplyText((prev) => ({ ...prev, [parentId]: '' }));
        setReplying((prev) => ({ ...prev, [parentId]: false }));
        fetchComments();
    };

    const handleDelete = async (commentId: number) => {
        await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
        fetchComments();
    };

    const handleUpvote = async (commentId: number) => {
        await fetch(`/api/comments/${commentId}/upvote`, {
            method: 'POST',
        });

        setComments(prev => updateCommentUpvoteState(prev, commentId, true));
        fetchComments();
    };

    const handleRemoveUpvote = async (commentId: number) => {
        await fetch(`/api/comments/${commentId}/upvote`, {
            method: 'DELETE',
        });

        setComments(prev => updateCommentUpvoteState(prev, commentId, false));
        fetchComments();
    };

    const updateCommentUpvoteState = (comments: Comment[], targetId: number, upvoted: boolean): Comment[] => {
        return comments.map(comment => {
            if (comment.commentId === targetId) {
                return {
                    ...comment,
                    hasUserUpvoted: upvoted,
                    upvoteCount: upvoted ? comment.upvoteCount + 1 : comment.upvoteCount - 1,
                    replies: comment.replies ? updateCommentUpvoteState(comment.replies, targetId, upvoted) : []
                };
            }

            return {
                ...comment,
                replies: comment.replies ? updateCommentUpvoteState(comment.replies, targetId, upvoted) : []
            };
        });
    };

    const toggleReply = (commentId: number) => {
        setReplying((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const renderComment = (c: Comment, depth = 0) => (
        <div key={c.commentId} className={`ml-${depth * 4} border-l border-zinc-700 pl-4 py-2`}>
            <div className="flex items-center mb-1">
                <a href={`/user/${c.userId}`}><span className="font-semibold">{c.name}</span></a>
                <span className="ml-auto text-xs text-zinc-400">{new Date(c.timestamp).toLocaleString()}</span>
            </div>
            <p className="text-sm">{c.text}</p>
            <div className="flex items-center text-sm mt-1 space-x-3">
                <span className="flex items-center">
                    <span>👍</span> {c.upvoteCount}
                </span>
                {session?.user?.id === c.userId && (
                    <button onClick={() => handleDelete(c.commentId)} className="text-red-400 hover:underline">Delete</button>
                )}
                {session?.user?.id && (
                    c.hasUserUpvoted ? (
                        <button onClick={() => handleRemoveUpvote(c.commentId)} className="text-zinc-400 hover:underline">Remove Upvote</button>
                    ) : (
                        <button onClick={() => handleUpvote(c.commentId)} className="hover:underline">Upvote</button>
                    )
                )}
                <button onClick={() => toggleReply(c.commentId)} className="hover:underline">Reply</button>
            </div>
            {replying[c.commentId] && (
                <div className="mt-2">
                    <textarea className="w-full bg-black border border-white p-1 text-sm rounded mb-1" rows={2} placeholder="Write a reply..." value={replyText[c.commentId] || ''} onChange={(e) => setReplyText((prev) => ({ ...prev, [c.commentId]: e.target.value }))} />
                    <button className="text-xs border border-white px-2 py-1 rounded hover:bg-white hover:text-black transition-colors" onClick={() => handleReplySubmit(c.commentId)}>Reply</button>
                </div>
            )}
            {/* Recursive replies */}
            <div className="ml-4">
                {c.replies && c.replies.map((reply) => renderComment(reply, depth + 1))}
            </div>
        </div>
    );

    useEffect(() => {
        if (session?.user?.id) {
            fetchComments();
        }
    }, [fetchComments, session]);

    return (
        <div className="mt-10">
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            {session?.user?.id ? (
                <>
                    <textarea className="w-full bg-black border border-white p-2 rounded mb-2" placeholder="Write a comment..." value={text} onChange={(e) => setText(e.target.value)} />
                    <button onClick={handleSubmit} disabled={!text.trim()} className="border border-white px-4 py-1 rounded mb-4 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Post</button>
                </>
            ) : (
                <div className="mb-4 text-zinc-400">Sign in to leave a comment</div>
            )}
            <div className="space-y-4">
                {comments.length > 0 ? comments.map((c) => renderComment(c)) : <div className="text-zinc-400">No comments yet</div>}
            </div>
        </div>
    );
}