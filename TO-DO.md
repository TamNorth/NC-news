## Test Output

It is **Recommended** to open this file in preview mode for readability.
Read through all errors messages, hints and any linked relevant notes as well as using any other [NC Notes](https://l2c.northcoders.com/courses/sd-notes/back-end#sectionId=,step=). Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.

---

### CORE GET `/api/articles?sort_by=author`

Assertion: all articles should be sorted by the sort_by value in the query: `sort_by=author`: expected ‘rogersop’ to equal ‘butter_bridge’
Hints:

- accept a `sort_by` query, with a value of any column name
- use `author` for the column to store the username that created the article
- ensure the array of articles is not empty
  Relevant Notes:
- [Handling Endpoint Queries](https://l2c.northcoders.com/courses/sd-notes/back-end/#sectionId=express-servers,step=queries)
- [Greenlisting](https://l2c.northcoders.com/courses/sd-notes/back-end/#sectionId=dynamic-queries,step=greenlisting)

---

### CORE POST `/api/articles/1/comments`

Assertion: expected 201 to equal 400
Hints:

- use a 400: Bad Request status code when `POST` request does not include all the required keys
  Relevant Notes:
- [Error Handling Middleware](https://l2c.northcoders.com/courses/sd-notes/back-end/#sectionId=error-handling,step=error-handling-middleware)
- [Common Error Status Codes](https://l2c.northcoders.com/courses/sd-notes/back-end/#sectionId=error-handling,step=common-errors-and-status-codes)
- [Custom Error Handling](https://l2c.northcoders.com/courses/sd-notes/back-end/#sectionId=error-handling,step=custom-errors)
