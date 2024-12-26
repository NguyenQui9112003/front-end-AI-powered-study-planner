export const adjustToUTC7 = (date: string | Date | null) => {
    if (!date) return null;
    const parsedDate = typeof date === "string" ? new Date(date) : date; // Chuyển chuỗi thành Date nếu cần
    parsedDate.setMinutes(parsedDate.getMinutes() + 420); // Thêm 420 phút = 7 giờ
    return parsedDate;
};