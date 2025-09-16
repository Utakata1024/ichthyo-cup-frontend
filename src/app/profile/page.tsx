"use client";
import { useEffect, useState } from "react";

export default function CheckLogin() {
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:4000/api/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setMe)
      .catch(console.error);
  }, []);

  if (!me) return <div>Loading...</div>;
  return (
    <div>
      <h2>Logged in as:</h2>
      <p>{me.display_name}</p>
      <p>{me.email}</p>
      <img src={me.images?.[0]?.url} alt="avatar" width={64} />
    </div>
  );
}
