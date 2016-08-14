import * as core from "./core";
import $ from "js_libs/hobo/dist/hobo.build";

const weather = {
    // weatherBar

    getDate () {
        /*eslint-disable */
        (function(){Date.shortMonths=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],Date.longMonths=["January","February","March","April","May","June","July","August","September","October","November","December"],Date.shortDays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],Date.longDays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];var t={d:function(){return(this.getDate()<10?"0":"")+this.getDate()},D:function(){return Date.shortDays[this.getDay()]},j:function(){return this.getDate()},l:function(){return Date.longDays[this.getDay()]},N:function(){return 0==this.getDay()?7:this.getDay()},S:function(){return this.getDate()%10==1&&11!=this.getDate()?"st":this.getDate()%10==2&&12!=this.getDate()?"nd":this.getDate()%10==3&&13!=this.getDate()?"rd":"th"},w:function(){return this.getDay()},z:function(){var t=new Date(this.getFullYear(),0,1);return Math.ceil((this-t)/864e5)},W:function(){var t=new Date(this.valueOf()),e=(this.getDay()+6)%7;t.setDate(t.getDate()-e+3);var n=t.valueOf();return t.setMonth(0,1),4!==t.getDay()&&t.setMonth(0,1+(4-t.getDay()+7)%7),1+Math.ceil((n-t)/6048e5)},F:function(){return Date.longMonths[this.getMonth()]},m:function(){return(this.getMonth()<9?"0":"")+(this.getMonth()+1)},M:function(){return Date.shortMonths[this.getMonth()]},n:function(){return this.getMonth()+1},t:function(){var t=this.getFullYear(),e=this.getMonth()+1;return 12===e&&(t=t++,e=0),new Date(t,e,0).getDate()},L:function(){var t=this.getFullYear();return t%400==0||t%100!=0&&t%4==0},o:function(){var t=new Date(this.valueOf());return t.setDate(t.getDate()-(this.getDay()+6)%7+3),t.getFullYear()},Y:function(){return this.getFullYear()},y:function(){return(""+this.getFullYear()).substr(2)},a:function(){return this.getHours()<12?"am":"pm"},A:function(){return this.getHours()<12?"AM":"PM"},B:function(){return Math.floor(1e3*((this.getUTCHours()+1)%24+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)/24)},g:function(){return this.getHours()%12||12},G:function(){return this.getHours()},h:function(){return((this.getHours()%12||12)<10?"0":"")+(this.getHours()%12||12)},H:function(){return(this.getHours()<10?"0":"")+this.getHours()},i:function(){return(this.getMinutes()<10?"0":"")+this.getMinutes()},s:function(){return(this.getSeconds()<10?"0":"")+this.getSeconds()},u:function(){var t=this.getMilliseconds();return(10>t?"00":100>t?"0":"")+t},e:function(){return/\((.*)\)/.exec((new Date).toString())[1]},I:function(){for(var t=null,e=0;12>e;++e){var n=new Date(this.getFullYear(),e,1),i=n.getTimezoneOffset();if(null===t)t=i;else{if(t>i){t=i;break}if(i>t)break}}return this.getTimezoneOffset()==t|0},O:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.floor(Math.abs(this.getTimezoneOffset()/60))+(0==Math.abs(this.getTimezoneOffset()%60)?"00":(Math.abs(this.getTimezoneOffset()%60)<10?"0":"")+Math.abs(this.getTimezoneOffset()%60))},P:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.floor(Math.abs(this.getTimezoneOffset()/60))+":"+(0==Math.abs(this.getTimezoneOffset()%60)?"00":(Math.abs(this.getTimezoneOffset()%60)<10?"0":"")+Math.abs(this.getTimezoneOffset()%60))},T:function(){return this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,"$1")},Z:function(){return 60*-this.getTimezoneOffset()},c:function(){return this.format("Y-m-d\\TH:i:sP")},r:function(){return this.toString()},U:function(){return this.getTime()/1e3}};Date.prototype.format=function(e){var n=this;return e.replace(/(\\?)(.)/g,function(e,i,r){return""===i&&t[r]?t[r].call(n):r})}}).call(this);
        /*eslint-enable */
    },

    getWeather () {
        let sunUp = false;
        const weatherTemp = document.getElementById( "weatherTemp" );
        const weatherIcon = document.getElementById( "weatherIcon" );
        const weatherDesc = document.getElementById( "weatherDesc" );
        // const weatherTool = document.getElementById( "weatherTool" );
        const weatherText = {
            dusk: "PDX bees are catching some z’s. Zzz.",
            rain: "PDX bees are out and about today, dreaming of bee-sized umbrellas.",
            snow: "PDX bees are staying snug inside their hives, drinking hot cocoa and watching Elf for the 17th time.",
            cloudy: "PDX bees are out and about, wishing the sun would come out to play.",
            clear: "PDX bees are soaking up the sun today, gathering up nectar, pollen and a super sweet tan.",
            storm: "PDX bees are snuggled up in their hives today, safe from the storm."
        };
        const weatherEmoji = {
            sunUp: "🕶🌅",
            sunDown: "🌙",
            clear: "",
            cloud: "",
            rain: "",
            storm: "",
            snow: ""
        };

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather",
            method: "GET",
            data: {
                q: "Portland,us",
                appid: "e8f818c60523591e3705d9d8db8c0caf",
                units: "imperial"
            },
            dataType: "json"
        })
        .then(( response ) => {
            const currentTemp = Math.round(response.main.temp);
            const timeSunset = new Date(response.sys.sunset * 1000).format("B");
            const timeNow = new Date().format("B");
            const weatherCurrentCode = response.weather[ 0 ].id;

            weatherTemp.innerHTML = currentTemp;

            if (timeSunset > timeNow) {
                sunUp = true;
                weatherIcon.innerHTML = weatherEmoji.sunUp;
            } else {
                weatherIcon.innerHTML = weatherEmoji.sunDown;
                weatherDesc.innerHTML = weatherText.dusk;
            }

            if (sunUp && weatherCurrentCode >= 200 && weatherCurrentCode <= 531) {
                // if any rain
                weatherIcon.innerHTML = "Rainy";
                weatherDesc.innerHTML = weatherText.rain;
            } else if (sunUp && weatherCurrentCode >= 600 && weatherCurrentCode <= 622) {
                // any snow
                weatherIcon.innerHTML = "Snow";
                weatherDesc.innerHTML = weatherText.snow;
            } else if (sunUp && weatherCurrentCode >= 801 && weatherCurrentCode <= 804) {
                // any clouds
                weatherIcon.innerHTML = "Cloudy";
                weatherDesc.innerHTML = weatherText.cloudy;
            } else if (sunUp && weatherCurrentCode >= 951 && weatherCurrentCode <= 957) {
                // clear
                weatherIcon.innerHTML = "Clear";
                weatherDesc.innerHTML = weatherText.clear;
            } else if (sunUp && weatherCurrentCode > 957) {
                // bad storm!
                weatherIcon.innerHTML = "Stormy";
                weatherDesc.innerHTML = weatherText.storm;
            }

            // After processed, render
            core.dom.weatherTool.addClass( "show" );
        })
        .catch(( error ) => {
            console.log( error );
        });
    },

    init () {
        this.getDate();
        this.getWeather();
    }
};

/******************************************************************************
 * Export
*******************************************************************************/
export default weather;