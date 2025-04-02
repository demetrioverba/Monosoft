import { query } from 'N';

export function getSqlResultAsMap(
    sqlString: string,
): { [p: string]: string | boolean | bigint| number | null | bigint }[] {
    const sqlResults: query.Result[] = query.runSuiteQL({
        query: sqlString,
    }).results;
    if (sqlResults) {
        return sqlResults.map((result) => {
            return result.asMap();
        });
    }
    return [];
}

export function formatDate(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
}