import { NextResponse } from 'next/server';

// 簡易的なランダム文字列生成関数
function generateRandomString(length: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export async function GET() {
  const spotifyAuthUrl = new URL('https://accounts.spotify.com/authorize');

  const state = generateRandomString(16);
  // セキュリティ対策のため、後でこのstate値をクッキーなどに保存する必要があります。

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID ?? '',
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI ?? '',
    scope: 'user-read-private user-read-email', // 必要なスコープをここに追加
    state: state,
  });

  spotifyAuthUrl.search = params.toString();

  // ユーザーをSpotifyの認証ページにリダイレクト
  return NextResponse.redirect(spotifyAuthUrl);
}