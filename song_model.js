const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'gis_analysis',
    password: 'postgres',
    port: 5432,
  });

  const getMerchants = () => {
    return new Promise(function(resolve, reject) {
      pool.query('SELECT * FROM song_locs WHERE latitude IS NOT NULL LIMIT 1000', (error, results) => {
        if (error) {
            console.log(error)
  
  
          reject(error)

        }
        
        resolve(results.rows);
      })
    }) 

    
  }

  const createMerchant = (body) => {
    return new Promise(function(resolve, reject) {
      const { values, bounds } = body
      console.log(values, bounds)
     
       pool.query(`SELECT * FROM song_locs WHERE (longitude BETWEEN ${bounds[0][0]} AND ${bounds[1][0]}) AND (latitude BETWEEN ${bounds[1][1]} AND ${bounds[0][1]} ) AND (released BETWEEN '${values[0]}-01-01' AND '${values[1]}-12-31')`, (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows)
      }) 
    })
  }

  const chartData = (body) => {
    return new Promise(function(resolve, reject) {
      const { val, rng } = body
      console.log(val, rng)
     
       pool.query(` WITH series AS (
        SELECT generate_series(timestamp '${rng[0]}-01-01', '${rng[1]}-12-31', '1 year') AS r_from), range AS (
        SELECT r_from, (r_from + '1 year') AS r_to FROM series 
      ) SELECT r_from, r_to,
        (SELECT count(*) FROM song_locs WHERE released BETWEEN r_from AND r_to),
      round((SELECT AVG(${val}) FROM song_locs WHERE released BETWEEN r_from AND r_to), 2) FROM range`, (error, results) => {
        if (error) {

          console.log(error)
          reject(error)
        }

        resolve(results.rows)
      }) 
    })
  }

  const arcGenres = (body) => {
    const { values, selection } = body
    console.log(values)
    let querStr = `WHERE ${selection} ILIKE ANY (ARRAY[`
    for (i in values) {
      console.log(i)
          if (i == (values.length - 1)) {
            querStr = querStr + `'%${values[i]}%'`
          } else {
            querStr = querStr + `'%${values[i]}%',`
          }
    }
    querStr = querStr + "])"
    console.log(querStr)
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM song_locs ${querStr} AND latitude IS NOT NULL`, (error, results) => {
        if (error) {
            console.log(error)
  
  
          reject(error)

        }
        
        resolve(results.rows);
      })
    }) 
  
  }



/*   WITH series AS (
    SELECT generate_series(timestamp '2004-01-01', '2020-12-31', '1 year') AS r_from -- 1950 = min, 2010 = max, 10 = 10 year interval
), range AS (
    SELECT r_from, (r_from + '1 year') AS r_to FROM series -- 9 = interval (10 years) minus 1
)
SELECT r_from, r_to,
(SELECT count(*) FROM song_locs WHERE released BETWEEN r_from AND r_to) as team_members,
round((SELECT AVG(danceability) FROM song_locs WHERE released BETWEEN r_from AND r_to), 2) as salary_avg

FROM range; */
module.exports = {
    getMerchants,
   createMerchant,
   chartData,
   arcGenres
  }

