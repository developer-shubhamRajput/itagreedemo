import React from "react";
import Logo from "../../assets/logo.svg"

const LandingPage = () => {
    return (
        <section className="shadow-md flex justify-between px-4 py-2">
            <img className="logo-img" alt="logo" src={Logo} />
        </section>
    )
}


export default LandingPage;