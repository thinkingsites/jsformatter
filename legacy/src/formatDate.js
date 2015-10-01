var dateComponents = {
    dd: function (value) {
        return value.getDate();
    },
    ddd: function (value) {
        return dateText.daysAbbr[value.getDay()];
    },
    dddd: function (value) {
        return dateText.days[value.getDay()];
    },
    hh: function (value) {
        var hours = value.getHours();
        if (hours > 12) {
            hours -= 12;
        }
        return pad(hours,"0",2,-1);
    },
    HH: function (value) {
        return pad(value.getHours(),"0",2,-1);
    },
    mm: function (value) {
        return pad(value.getMinutes(),"0",2,-1);
    },
    MM: function (value) {
        return value.getMonth() + 1;
    },
    MMM: function (value) {
        return dateText.monthAbbr[value.getMonth()];
    },
    MMMM: function (value) {
        return dateText.months[value.getMonth()];
    },
    ss: function (value) {
        return pad(value.getSeconds(),"0",2,-1);
    },
    tt: function (value) {
        return (value.getHours() > 11 ? "PM" : "AM");
    },
    yy: function (value) {
        return value.getFullYear().toString().substring(2);
    },
    yyyy: function (value) {
        return value.getFullYear();
    },
    zz: function (value) {
        var mins = value.getTimezoneOffset(),
            result =
                (mins > 0 ? "-" : "") + // if the offset is positive, the time zone is negative
                pad(Math.abs(Math.floor(mins / 60)), "0", 2, -1).toString();
        return result;
    },
    zzz: function (value) {
        var
            mins = value.getTimezoneOffset(),
            result =
                (mins > 0 ? "-" : "") + // if the offset is positive, the time zone is negative
                pad(Math.abs(Math.floor(mins / 60)), "0", 2, -1).toString() + ":" +
                pad(mins % 60, "0", 2, -1);
        return result;
    }
};
var dateShorts = {
    d: "dd/MM/yyyy",
    D: "MMMM dd, yyyy",
    t: "hh:mm tt",
    T: "hh:mm:ss tt",
    f: "MMMM dd, yyyy hh:mm tt",
    F: "MMMM dd, yyyy hh:mm:ss tt",
    g: "dd/MM/yyyy hh:mm tt",
    G: "dd/MM/yyyy hh:mm:ss tt",
    M: "MMMM dd",
    r: "ddd, dd MMM yyyy hh:mm:ss GMT",
    s: "yyyy-MM-ddThh:mm:ss",
    u: "yyyy-MM-dd hh:mm:ssZ",
    U: "MMMM dd,yyyy hh:mm:ss tt",
    Y: "MMMM, yyyy"
};
var dateText = {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    daysAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};
var dateNames = getProperties(dateComponents, "length desc");

function formatDate(format,value) {

    var result = [];

    // if the format is a shortcut, convert the shortcut to the actual format
    if(dateShorts[format]){
        format = dateShorts[format];
    }

    // loop through and replace all instances
    for (i = 0; i < format.length; i += 1) {

        // do escape
        if (format.charAt(i) === "\\") {
            result.push(format.charAt(i + 1));
            i += 1;
            continue;
        }

        // do format
        var pushed = false;

        // loop through every dateComponent and look for the next match in the format
        for (j = 0; j < dateNames.length; j += 1) {
           var dateName = dateNames[j];
            if (format.substring(i, i + dateName.length) === dateName) {
                result.push((dateComponents[dateName].apply(null, [value]) || "").toString());
                i += dateName.length - 1;
                pushed = true;
                break;
            }
        }

        if (pushed) {
            continue;
        }

        result.push(format.charAt(i));
    }
    result = result.join('');
    return result;
}