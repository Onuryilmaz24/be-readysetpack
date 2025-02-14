export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().split('.')[0] + 'Z';
}
export default formatDate