import { useEffect, useState } from "react";
import useStore from "@/utils/store/store";

// True once the saved login has been loaded from localStorage on the client.
//
// Why this is needed: zustand renders the store's initial state (user: null,
// token: null) during the first render after a page load, so React's server
// HTML and first client render match. Only after that does it switch to the
// saved values. Any page that checks `user` in its first render or first
// useEffect therefore sees null on refresh and redirects to login, or picks
// the wrong starting tab for the user's role. Render pages only when this
// returns true and they see the real user from their very first render.
export default function useAuthReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const done = () => setReady(true);
    if (useStore.persist.hasHydrated()) done();
    const unsubscribe = useStore.persist.onFinishHydration(done);
    return unsubscribe;
  }, []);
  return ready;
}
