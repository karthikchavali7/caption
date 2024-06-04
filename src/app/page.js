import Button from "@/components/Button";

export default function Home() {
 
  return (
    <>
      
      <div className="text-center mt-12 sm:mt-24 mb-8">
        <h1 className="text-xl sm:text-3xl">Add epic captions</h1>
        <h2 classname="text-white/75 text-sm sm:text-base">Just upload your video</h2>
      </div>
      <div className="text-center">
        <Button/>
       
      </div>
      <div className="flex  justify-around mt-8 sm:mt-12 items-center">
        <div className="hidden sm:block bg-gray-800/50 w-[240px] h-[480px] rounded-xl"></div>
        <div className="bg-gray-800/50 w-[240px] h-[480px] rounded-xl"></div>
      </div>
   </> 
  )
}
