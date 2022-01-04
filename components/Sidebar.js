import {
	HomeIcon,
	LibraryIcon,
	PlusCircleIcon,
	RssIcon,
	SearchIcon,
} from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { selectedPlayListState } from "../atoms/playListAtom";
import useSpotify from "../hooks/useSpotify";

function Sidebar() {
	const { data: session, status } = useSession();

	const spotify = useSpotify();

	const [playList, setPlayList] = useState([]);
	const [selectedPlayList, setSelectedPlayList] = useRecoilState(
		selectedPlayListState
	);

	useEffect(() => {
		if (spotify.getAccessToken()) {
			spotify.getUserPlaylists().then((data) => {
				setPlayList(data.body.items);
			});
		}
	}, [session, spotify]);

	console.log(playList);

	return (
		<div className='hidden md:block text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-auto scrollbar-hide h-screen md:max-w-[12rem] lg:max-w-[15rem] pb-36'>
			<div className='space-y-4'>
				<button className='flex items-center space-x-2 hover:text-white'>
					<HomeIcon className='w-5 h-5' />
					<p>Home</p>
				</button>

				<button className='flex items-center space-x-2 hover:text-white'>
					<SearchIcon className='w-5 h-5' />
					<p>Search</p>
				</button>

				<button className='flex items-center space-x-2 hover:text-white'>
					<LibraryIcon className='w-5 h-5' />
					<p>Your Library</p>
				</button>

				<hr className='border-t-[0.1px] border-gray-900' />

				<button className='flex items-center space-x-2 hover:text-white'>
					<PlusCircleIcon className='w-5 h-5 text-red-500' />
					<p>Create Playlist</p>
				</button>

				<button className='flex items-center space-x-2 hover:text-white'>
					<HeartIcon className='w-5 h-5 text-blue-500' />
					<p>Liked Songs</p>
				</button>

				<button className='flex items-center space-x-2 hover:text-white'>
					<RssIcon className='w-5 h-5 text-green-500' />
					<p>Your Episodes</p>
				</button>

				<hr className='border-t-[0.1px] border-gray-900' />

				{playList.map(({ id, name }) => (
					<p
						key={id}
						onClick={() => setSelectedPlayList(id)}
						className='cursor-pointer hover:text-white truncate'
					>
						{name}
					</p>
				))}
			</div>
		</div>
	);
}

export default Sidebar;
