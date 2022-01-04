import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playListState, selectedPlayListState } from "../atoms/playListAtom";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
// import { shuffle } from "lodash";
import { formatDuration, shuffle } from "../lib/utils";

const colors = [
	"from-indigo-500",
	"from-blue-500",
	"from-yellow-500",
	"from-green-500",
	"from-red-500",
	"from-pink-500",
	"from-purple-500",
];

function Center() {
	const spotify = useSpotify();
	const { data: session } = useSession();
	const [color, setColor] = useState(null);
	const selectedPlayList = useRecoilValue(selectedPlayListState);
	const [playList, setPlayList] = useRecoilState(playListState);
	const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

	const playSong = (track) => {
		console.log(track);
		setCurrentTrack(track.id);
		setIsPlaying(true);
		spotify.play({
			uris: [track.uri],
		});
	};

	useEffect(() => {
		setColor(shuffle(colors).pop());
	}, [selectedPlayList]);

	useEffect(() => {
		spotify
			.getPlaylist(selectedPlayList)
			.then((data) => {
				setPlayList(data.body);
			})
			.catch((error) => console.log("Something went wrong!", error));
	}, [spotify, selectedPlayList]);

	// console.log(playList);

	return (
		<div className='flex-grow h-screen overflow-y-auto scrollbar-hide'>
			<header className='absolute top-5 right-8'>
				<div
					onClick={signOut}
					className='flex items-center bg-black space-x-3 opacity-80 hover:opacity-70 cursor-pointer rounded-full p-1 pr-2 text-white'
				>
					<img
						src={
							session?.user?.image ||
							"https://res.cloudinary.com/moh-x/image/upload/v1640176094/projects/spotifi/686-6865458_question-mark-clipart-black-and-white-freehand-drawn_vak2ra.png"
						}
						alt={`${session?.user?.name}'s image`}
						className='w-10 h-10 rounded-full'
					/>
					<h2>{session?.user?.name}</h2>
					<ChevronDownIcon className='h-5 w-5' />
				</div>
			</header>

			<section
				className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
			>
				<img
					src={playList?.images?.[0].url}
					alt=''
					className='h-44 w-44 shadow-2xl'
				/>

				<div>
					<p>PLAYLIST</p>
					<h2 className='text-2xl md:text-3xl xl:text-5xl font-bold'>
						{playList?.name}
					</h2>
				</div>
			</section>

			<div className='p-8 flex flex-col space-y-1 pb-28 text-gray-500 text-xs md:text-sm'>
				{playList?.tracks.items.map(({ track }, idx) => (
					<div
						key={track.id}
						onClick={() => playSong(track)}
						className='grid grid-cols-2 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer'
					>
						<div className='flex items-center space-x-4'>
							<p>{idx + 1}</p>
							<img
								src={track.album.images[0].url}
								alt=''
								className='h-10 w-10'
							/>

							<div className=''>
								<p className='w-36 lg:w-64 text-white truncate'>{track.name}</p>
								<p className='w-40'>{track.artists[0].name}</p>
							</div>
						</div>

						<div className='flex items-center justify-between ml-auto md:ml-0'>
							<p className='hidden w-40 lg:w-72 md:inline'>
								{track.album.name}
							</p>
							<p>{formatDuration(track.duration_ms)}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Center;
