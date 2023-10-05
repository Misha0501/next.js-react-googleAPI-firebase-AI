import { Divider } from "@tremor/react";
import React, { useState } from "react";

function AddHighlightComponent() {
  const [textAreaWordCount, setTextAreaWordCount] = useState(0);
  const [titleInputWordCount, setTitleInputWordCount] = useState(0);

  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <p className={"text-md font-bold"}>Highlight title</p>

        <input
          onChange={(e) => setTitleInputWordCount(e.target.value.length)}
          maxLength={150}
          placeholder="Quite location"
          className={
            "border-2 border-[#97B6FF] rounded-md max-w-[676px] outline-0  p-3 text-gray-500 text-md"
          }
        />
        <p className={"text-xs font-normal text-[#222222]"}>
          {titleInputWordCount}/150
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <p className={"text-md font-bold"}>Highlight description</p>

        <textarea
          onChange={(e) => setTextAreaWordCount(e.target.value.length)}
          maxLength={150}
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sapien ornare vitae amet."
          className={
            "border-2 border-[#97B6FF] rounded-md max-w-[676px] outline-0 min-h-[150px] p-3 text-gray-500 text-md"
          }
        />
        <p className={"text-xs font-normal text-[#222222]"}>
          {textAreaWordCount}/150
        </p>
      </div>
      <Divider />
    </>
  );
}

export default AddHighlightComponent;
