
export default function Spinner ()  {
    return (
    <div className="flex flex-1 flex-col justify-center items-center gap-4">
      <div className=" text-center text-xl font-semibold">Loading...</div>
      <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
    )
}