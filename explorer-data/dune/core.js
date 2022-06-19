const fetch = require("node-fetch");

const { cookie } = require("./cookie.json");
let authorization = null
let accessToken = null



async function updateQuery(
  query,
  query_id = 897811
) {
  const req = await fetch("https://core-hsr.duneanalytics.com/v1/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
      authorization: authorization,
      "content-type": "application/json",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-dune-access-token": accessToken,
    },
    referrer: "https://dune.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
      operationName: "UpsertQuery",
      variables: {
        favs_last_24h: false,
        favs_last_7d: false,
        favs_last_30d: false,
        favs_all_time: true,
        object: {
          id: query_id,
          schedule: null,
          dataset_id: 4,
          name: "New Query",
          query: query,
          user_id: 117345,
          description: "",
          is_archived: false,
          is_temp: true,
          tags: [],
          parameters: [],
          visualizations: {
            data: [
              {
                id: 1535654,
                type: "table",
                name: "Query results",
                options: {},
              },
            ],
            on_conflict: {
              constraint: "visualizations_pkey",
              update_columns: ["name", "options"],
            },
          },
        },
        on_conflict: {
          constraint: "queries_pkey",
          update_columns: [
            "dataset_id",
            "name",
            "description",
            "query",
            "schedule",
            "is_archived",
            "is_temp",
            "tags",
            "parameters",
          ],
        },
        session_id: 117345,
      },
      query:
        "mutation UpsertQuery($session_id: Int!, $object: queries_insert_input!, $on_conflict: queries_on_conflict!, $favs_last_24h: Boolean! = false, $favs_last_7d: Boolean! = false, $favs_last_30d: Boolean! = false, $favs_all_time: Boolean! = true) {\n  insert_queries_one(object: $object, on_conflict: $on_conflict) {\n    ...Query\n    favorite_queries(where: {user_id: {_eq: $session_id}}, limit: 1) {\n      created_at\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment Query on queries {\n  ...BaseQuery\n  ...QueryVisualizations\n  ...QueryForked\n  ...QueryUsers\n  ...QueryFavorites\n  __typename\n}\n\nfragment BaseQuery on queries {\n  id\n  dataset_id\n  name\n  description\n  query\n  is_private\n  is_temp\n  is_archived\n  created_at\n  updated_at\n  schedule\n  tags\n  parameters\n  __typename\n}\n\nfragment QueryVisualizations on queries {\n  visualizations {\n    id\n    type\n    name\n    options\n    created_at\n    __typename\n  }\n  __typename\n}\n\nfragment QueryForked on queries {\n  forked_query {\n    id\n    name\n    user {\n      name\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment QueryUsers on queries {\n  user {\n    ...User\n    __typename\n  }\n  __typename\n}\n\nfragment User on users {\n  id\n  name\n  profile_image_url\n  __typename\n}\n\nfragment QueryFavorites on queries {\n  query_favorite_count_all @include(if: $favs_all_time) {\n    favorite_count\n    __typename\n  }\n  query_favorite_count_last_24h @include(if: $favs_last_24h) {\n    favorite_count\n    __typename\n  }\n  query_favorite_count_last_7d @include(if: $favs_last_7d) {\n    favorite_count\n    __typename\n  }\n  query_favorite_count_last_30d @include(if: $favs_last_30d) {\n    favorite_count\n    __typename\n  }\n  __typename\n}\n",
    }),
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  return await req.json();
}

async function getPos(job_id) {
  const req = await fetch("https://core-hsr.duneanalytics.com/v1/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
      authorization: authorization,
      "content-type": "application/json",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-dune-access-token": accessToken,
    },
    referrer: "https://dune.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
      operationName: "GetQueuePosition",
      variables: {
        job_id: job_id,
      },
      query:
        "query GetQueuePosition($job_id: uuid!) {\n  view_queue_positions(where: {id: {_eq: $job_id}}) {\n    pos\n    __typename\n  }\n  jobs_by_pk(id: $job_id) {\n    id\n    user_id\n    category\n    created_at\n    locked_until\n    __typename\n  }\n}\n",
    }),
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
  return req.json();
}

async function reqSession() {
  const req = await fetch("https://dune.com/api/auth/session", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
      "content-type": "application/json",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      cookie: cookie,
    },
    referrer: "https://dune.com/queries/897811",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
  const json = await req.json();
  authorization = "Bearer " + json["token"];
  accessToken = json["accessToken"];
  // return json
}

async function findByJoob(job_id = "") {
  for (let index = 0; index < 100; index++) {
    const req = await getPos(job_id);
    console.log("jobs_by_pk", job_id, req.data.jobs_by_pk);
    if (!req.data.jobs_by_pk) break;
    await new Promise((resolve) => {
      setTimeout(resolve, 600);
    });
  }

  const req = await fetch("https://core-hsr.duneanalytics.com/v1/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
      authorization: authorization,
      "content-type": "application/json",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-dune-access-token": accessToken,
    },
    referrer: "https://dune.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
      operationName: "FindResultDataByJob",
      variables: {
        job_id: job_id,
      },
      query:
        "query FindResultDataByJob($job_id: uuid!) {\n  query_results(where: {job_id: {_eq: $job_id}, error: {_is_null: true}}) {\n    id\n    job_id\n    runtime\n    generated_at\n    columns\n    __typename\n  }\n  query_errors(where: {job_id: {_eq: $job_id}}) {\n    id\n    job_id\n    runtime\n    message\n    metadata\n    type\n    generated_at\n    __typename\n  }\n  get_result_by_job_id(args: {want_job_id: $job_id}) {\n    data\n    __typename\n  }\n}\n",
    }),
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
  return await req.json();
}

async function excuteQuery(query_id = 897811, parameters = []) {
  const req = await fetch("https://core-hsr.duneanalytics.com/v1/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
      authorization: authorization,
      "content-type": "application/json",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-dune-access-token": accessToken,
    },
    referrer: "https://dune.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
      operationName: "ExecuteQuery",
      variables: {
        query_id: query_id,
        parameters: parameters,
      },
      query:
        "mutation ExecuteQuery($query_id: Int!, $parameters: [Parameter!]!) {\n  execute_query(query_id: $query_id, parameters: $parameters) {\n    job_id\n    __typename\n  }\n}\n",
    }),
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
  const res = await req.json();
  const job_id = res.data.execute_query.job_id;
  const jobRes = await findByJoob(job_id);
  return jobRes;
}



module.exports = {
  updateQuery,
  excuteQuery,
  reqSession,
};

