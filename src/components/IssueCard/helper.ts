export function getDaysAgo(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();

  // Calculate the difference in milliseconds between the two dates
  const differenceInMs = today.getTime() - date.getTime();

  // Convert milliseconds to days
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  let daysAgoText = "";

  switch (differenceInDays) {
    case 0:
      daysAgoText = "Today";
      break;

    case 1:
      daysAgoText = `Yesterday`;
      break;

    default:
      daysAgoText = `${differenceInDays} days ago`;
      break;
  }

  return daysAgoText;
}
