import Link from 'next/link';

export default function TopPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-8">MusiChat</h1>
            <Link href=""> {/* Spotify認証へのルート */}
                <button className="bg-transparent text-purple-400 font-bold py-2 px-4 rounded-full border border-purple-400 shadow-lg hover:bg-purple-400 hover:text-gray-900 transition-colors">
                    ログイン
                </button>
            </Link>
        </main>
    )
}
