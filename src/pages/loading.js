import React, { useState } from "react";
import LoadingCss from "../css/loading.module.css"

const Loading = () => {
   

    return (
        <>
<div class={LoadingCss.loading}>
    <div class={LoadingCss.lo_circle}></div>
</div>
        </>
    )
}

export default Loading;