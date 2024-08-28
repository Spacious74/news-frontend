
function customeDate() {

    const date = new Date();

    let dateString = "";
    const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    dateString = days[date.getDay()] + " , " + months[date.getMonth()] + " " + date.getDate() +" "+ date.getFullYear();
    // console.log(dateString);
    return dateString;
}

export default customeDate
