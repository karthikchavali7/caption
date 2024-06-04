'use client';
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Button() {
  const [Upload,setUpload]=useState(false)
  const router=useRouter();
    async function upload(e){
        e.preventDefault();
        const files=e.target.files;
        if (files.length>0){
            const file=files[0];
            setUpload(true)
            
            const res=await axios.postForm('/api/upload',{
                file,
            });
            setUpload(false)
            const newName=res.data.newName;
            router.push('/'+newName)

        }
        
      }
  return (
    <>
    {Upload && (
      <div>
        <h1>Uploading...</h1>
      </div>
    )}
       <label className="bg-green-400 py-2 px-4 rounded-full inline-flex gap-2 border-blue-500 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
</svg>
<span>choose file</span><input type="file" onChange={upload} className="hidden"/></label>
    </>
  )
}
