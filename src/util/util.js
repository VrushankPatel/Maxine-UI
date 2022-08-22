const util = {
    url: process.env.REACT_APP_API_URL || "",
    lightTheme: {
        backgroundColor: "#ECEBEF",
        color: "black"
    },
    darkTheme: {
        backgroundColor: "black",
        color: "white"
    },
    SSS: {
        "RR": "Round Robin",
        "CH": "Consistent Hashing",
        "RH": "Rendezvous Hashing"
    }
}

export default util;