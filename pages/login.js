import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
	return (
		<div className='flex flex-col justify-center items-center bg-black min-h-screen w-full'>
			<img
				src='https://res.cloudinary.com/moh-x/image/upload/v1640168606/projects/spotifi/fPuEa9V_opri6z.png'
				alt='Spotify logo'
				className='w-52 mb-5'
			/>

			{Object.values(providers).map((provider) => (
				<div key={provider.name}>
					<button
						onClick={() => signIn(provider.id, { callbackUrl: "/" })}
						className='bg-[#18D860] text-white p-5 rounded-2xl'
					>
						Login with {provider.name}
					</button>
				</div>
			))}
		</div>
	);
}

export default Login;

export async function getServerSideProps() {
	const providers = await getProviders();

	return {
		props: {
			providers,
		},
	};
}
