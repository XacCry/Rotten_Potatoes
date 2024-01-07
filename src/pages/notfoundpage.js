import React from "react";
import notfoundCss from "../css/notfound.module.css";
const NotFound = () => {
    return (
        <div className={notfoundCss.container}>
            <div className={notfoundCss.containertext}>
                <label className={notfoundCss.Title}>404</label>
                <label className={notfoundCss.description}>Page Not Found</label>
                <a href="/" className={notfoundCss.goback}>GO BACK</a>
            </div>
            <img src="https://scontent.fbkk29-1.fna.fbcdn.net/v/t1.15752-9/394457892_1672833233241862_4956274021755319669_n.png?_nc_cat=101&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=uGd8vjxbn0cAX8XLf3x&_nc_ht=scontent.fbkk29-1.fna&_nc_e2o=s&oh=03_AdTS0qjkqtV4owPQUCVghnyA6Uf51WmNy3BDoYyv4C0aow&oe=655AFEA9" className={notfoundCss.img} alt="Not Found" />
        </div>
    );
}

export default NotFound;
