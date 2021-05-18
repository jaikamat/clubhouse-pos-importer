const printStyle = `
    body {
        font-family: 'helvetica neue', helvetica, arial, sans-serif;
    }

    table {
        table-layout: fixed;
        width: 100%;
        border-collapse: collapse;
        border: 1px solid gray;
        text-align: left;
    }

    thead th:nth-child(1) {
        width: 30%;
    }

    thead th:nth-child(2) {
        width: 20%;
    }

    thead th:nth-child(3) {
        width: 15%;
    }

    thead th:nth-child(4) {
        width: 35%;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 10px;
    }

    tfoot {
        text-align: right !important;
    }
`;

/**
 * We're creating a new tab here for the modal table and writing CSS to it - not the most elegant solution from a UX and
 * code standpoint, but time was of the essence for this release. Refactor down the road.
 *
 * The id cash-report is found on the cash report table
 */
export default function printCashReport() {
    const divToPrint = document.getElementById('cash-report')!;
    const popup = window.open('', '_blank');
    if (popup) {
        popup.document.open();
        popup.document.write(`<html>`);
        popup.document.write(`<head>`);
        popup.document.write(`<title>Cash Report</title>`);
        popup.document.write(`<style>${printStyle}</style>`);
        popup.document.write(`</head>`);
        popup.document.write(`<body onload="window.print()">`);
        popup.document.write(`${divToPrint.innerHTML}`);
        popup.document.write(`</body>`);
        popup.document.write(`</html>`);
        popup.document.close();
    }
}
