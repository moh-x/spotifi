import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
	FastForwardIcon,
	PauseIcon,
	PlayIcon,
	ReplyIcon,
	RewindIcon,
	SwitchHorizontalIcon,
	VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
	const spotify = useSpotify();
	const { data: session, status } = useSession();
	const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
	const [volume, setVolume] = useState(50);
	const songInfo = useSongInfo();

	const fetchCurrentSong = () => {
		if (!songInfo) {
			spotify.getMyCurrentPlayingTrack().then((data) => {
				console.log("Now playing", data.body?.item?.name);
				setCurrentTrack(data.body?.item?.id);

				spotify.getMyCurrentPlaybackState().then((data) => {
					setIsPlaying(data.body?.is_playing);
				});
			});
		}
	};

	const playOrPause = () => {
		spotify.getMyCurrentPlaybackState().then((data) => {
			if (data.body?.is_playing) {
				spotify.pause();
				setIsPlaying(false);
			} else {
				spotify.play();
				setIsPlaying(true);
			}
		});
	};

	const debouncedAdjustVolume = useCallback(
		debounce((volume) => {
			spotify.setVolume(volume).catch((error) => console.log(error));
		}, 300),
		[]
	);

	useEffect(() => {
		if (spotify.getAccessToken() && !currentTrack) {
			fetchCurrentSong();
			setVolume(50);
		}
	}, [currentTrack, spotify, session]);

	useEffect(() => {
		if (volume > 0 && volume < 100) {
			debouncedAdjustVolume(volume);
		}
	}, [volume]);

	return (
		<div className='grid grid-cols-3 text-xs md:text-sm px-2 md:px-8 h-24 bg-gradient-to-b from-black to-gray-900 text-white'>
			<div className='flex items-center space-x-4'>
				<img
					src={songInfo?.album.images?.[0]?.url}
					alt=''
					className='hidden md:inline h-10 w-10'
				/>
				<div>
					<h3>{songInfo?.name}</h3>
					<p>{songInfo?.artists?.[0]?.name}</p>
				</div>
			</div>
			<div className='flex items-center justify-evenly'>
				<SwitchHorizontalIcon className='button' />
				<RewindIcon
					onClick={() => spotify.skipToPrevious()}
					className='button'
				/>
				{isPlaying ? (
					<PauseIcon onClick={playOrPause} className='button w-10 h-10' />
				) : (
					<PlayIcon onClick={playOrPause} className='button w-10 h-10' />
				)}
				<FastForwardIcon
					onClick={() => spotify.skipToNext()}
					className='button'
				/>
				<ReplyIcon className='button' />
			</div>
			<div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
				<VolumeDownIcon
					onClick={() => volume > 0 && setVolume(volume - 10)}
					className='button'
				/>
				<input
					type='range'
					min={0}
					max={100}
					value={volume}
					onChange={(e) => setVolume(Number(e.target.value))}
					className='w-14 md:w-28'
				/>
				<VolumeUpIcon
					onClick={() => volume < 100 && setVolume(volume + 10)}
					className='button'
				/>
			</div>
		</div>
	);
}

export default Player;
