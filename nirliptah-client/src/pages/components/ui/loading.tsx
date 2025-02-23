type Loading = {
    w: number,
}

export default function Loading({ w }: Loading) {
    return (
        <>
            <img src="/src/assets/images/loading.gif" width={w} />
        </>
    )
}

export function LoadingScreen(){
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <img src="/src/assets/images/loading.gif" className="w-10" />
        </div>
    )
}

export function LoadingGoogleAccess(){
    return (
            <img src="/src/assets/images/LoadingGoogleAuth.gif" className="w-7" />
    )
}

