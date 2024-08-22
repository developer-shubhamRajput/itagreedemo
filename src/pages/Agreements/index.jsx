import React from "react";
import MyJotForm from "../../common/MyJotForm";


const Agreements = () => {

    return (
        <div className="w-full flex items-center justify-center ">
             <div className="w-full border rounded-lg text-center  p-4 shadow-sm">
                        <h1 className="text-xl font-semibold text-[#F81717] my-1">Employment Contract Questionnaire</h1>
                        <MyJotForm />
                    </div>
        </div>
    )
}

export default Agreements;
