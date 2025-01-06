export const adjustTime = (date: string | Date | null): string | null => {
    if (!date) return null;
    const parsedDate = typeof date === "string" ? new Date(date) : new Date(date.getTime());
    parsedDate.setMinutes(parsedDate.getMinutes());
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");


    return `${year}-${month}-${day}T${hours}:${minutes}`;
};
