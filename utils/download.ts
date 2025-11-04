// Function to convert an array of objects to a CSV string
const convertToCSV = (data: any[]): string => {
    if (!data || data.length === 0) {
        return '';
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

// Function to trigger the download of a file
const triggerDownload = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * Downloads an array of objects as a CSV file.
 * @param data The array of objects to download.
 * @param fileName The name of the file to be downloaded.
 */
export const downloadData = (data: any[], fileName: string) => {
    const csvContent = convertToCSV(data);
    triggerDownload(csvContent, fileName, 'text/csv;charset=utf-8;');
};

/**
 * Downloads a string as a text file.
 * @param textContent The string content to download.
 * @param fileName The name of the file to be downloaded.
 */
export const downloadText = (textContent: string, fileName: string) => {
    triggerDownload(textContent, fileName, 'text/plain;charset=utf-8;');
};
