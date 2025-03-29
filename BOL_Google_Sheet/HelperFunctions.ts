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