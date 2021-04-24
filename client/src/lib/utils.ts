export {}

export const getInitials = (fullname: string) => {
    let names = fullname.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
}

/**
 * Implement time ago
 * **************************************************************
 */

 const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  
  function getFormattedDate(date: Date, prefomattedDate : string | boolean = false, hideYear=false) {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();
  
    if (minutes < 10) {
      // Adding leading zero to minutes
      minutes = parseInt(`0${ minutes }`);
    }
  
    if (prefomattedDate) {
      // Today at 10:20
      // Yesterday at 10:20
      return `${ prefomattedDate } at ${ hours }:${ minutes }`;
    }
  
    if (hideYear) {
      //January 10, at 10:20
      return `${ month } ${ day }, at ${ hours }:${ minutes }`;
    }
  
    // January 10, 2017 at 10:20
    return `${ month } ${ day }, ${ year } at ${ hours }:${ minutes }`;
  }
  
  /** Time Ago main function */
  export function timeAgo(dateParam: string | number  | Date) {
  
    dateParam = new Date(dateParam);
    const date = dateParam
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today.getTime() - DAY_IN_MS);
    const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();
  
  
    if (seconds < 5) {
      return 'now';
    } else if (seconds < 60) {
      return `${ seconds } seconds ago`;
    } else if (seconds < 90) {
      return 'about a minute ago';
    } else if (minutes < 60) {
      return `${ minutes } minutes ago`;
    } else if (isToday) {
      return getFormattedDate(date, 'Today'); // Today at 10:20
    } else if (isYesterday) {
      return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
    } else if (isThisYear) {
      return getFormattedDate(date, false, true); // 10. January at 10:20
    }
    
    console.log(getFormattedDate(date))
  
    return getFormattedDate(date); // 10. January 2017. at 10:20
  }

  export function msToDate(_ms: number) {
    var time = new Date(_ms)
  
    var year = time.getFullYear()
    var month = time.getMonth() + 1
    var day = time.getDate()
  
    return `${day}/${month}/${year}`
  }