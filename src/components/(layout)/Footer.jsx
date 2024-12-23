export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="p-6 md:px-12 bg-black text-gray-400">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-sm">
            <FooterSection
                title="TuneStats 🎵"
                content="Track your Spotify stats, share profiles, and compare music tastes with friends."
                extra="Music data, album covers, and song previews are provided by Spotify. Spotify is a trademark of Spotify AB."
            />
            <FooterSection title="TOOLS" links={["Roast my Spotify 🔥"]} />
            <FooterSection
                title="GLOBAL"
                links={[
                    "Most Followed Artists",
                    "Most Popular Artists",
                    "Most Popular Songs",
                    "Most Popular Albums",
                ]}
            />
            <FooterSection
                title="MORE"
                links={["Blog", "Terms of Service", "Privacy Policy", "Permissions"]}
            />
        </div>
        <div className="mt-12 border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-500 font-medium">
                &copy; {currentYear} TuneStats. All rights reserved.
            </p>
        </div>
    </footer>
      
    )
}
function FooterSection({ title, content, links, extra }) {
    return (
        <div>
            <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
            {content && <p>{content}</p>}
            {extra && <p className="mt-4">{extra}</p>}
            {links && (
                <ul className="space-y-3">
                    {links.map((link, idx) => (
                        <li key={idx}>
                            <a href="#" className="hover:text-white transition-colors">{link}</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
