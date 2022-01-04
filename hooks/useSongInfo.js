import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState } from "../atoms/songAtom";
import useSpotify from "./useSpotify";

function useSongInfo() {
	const spotify = useSpotify();
	const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
	const [songInfo, setSongInfo] = useState(null);

	useEffect(() => {
		const fetchSongInfo = async () => {
			if (currentTrack) {
				const trackInfo = await fetch(
					`https://api.spotify.com/v1/tracks/${currentTrack}`,
					{
						headers: {
							Authorization: `Bearer ${spotify.getAccessToken()}`,
						},
					}
				).then((res) => res.json());

				setSongInfo(trackInfo);
			}
		};

		fetchSongInfo();
	}, [spotify, currentTrack]);

	return songInfo;
}

export default useSongInfo;
