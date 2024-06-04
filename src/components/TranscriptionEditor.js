import TranscriptionItem from "@/components/TranscriptionItem";

export default function TranscriptionEditor({awsTranscriptionItems,setAwsTranscriptionItems}) {
    function updateTranscriptionItem(index,prop,ev){
        const newAwsItems=[...awsTranscriptionItems];
         newAwsItems[index][prop]=ev.target.value; 
         setAwsTranscriptionItems(newAwsItems);
      }
  return (
    <div>
      <div className="flex gap-1 sticky top-0 bg-blue-600  rounded-lg py-1">
            <div className="w-[230px]">From</div>
            <div className="w-[145px]">End</div>
            <div className="w-24">Content</div>
          </div>
          {awsTranscriptionItems.length > 0 &&(
            <div className="h-48 sm:h-auto overflow-y-scroll sm:overflow-auto">
              { awsTranscriptionItems.map((item,key) => (
            <div key={key}><TranscriptionItem handleStartTimeChange={(ev)=>{
              updateTranscriptionItem(key,'start_time',ev)
            
            }} handleEndTimeChange={(ev)=>{updateTranscriptionItem(key,'end_time',ev)}} HandleContentChange={(ev)=>{updateTranscriptionItem(key,'content',ev)}} item={item} /></div>
            
          ))}
            </div>
          )}
    </div>
  )
}
