## Code Challenge

Create a microservice that returns GIF response depending on the change of weather for the **given** location.

- If tomorrow's forecasted day temperature **increases** compared to today then the service returns a GIF image for keyword or tag `hot`
- If tomorrow's forecasted day temperature **decreases** compared to today then the service returns a GIF image for keyword or tag `cold`

### 3rd Party APIs:

To implement the service, you would need those 3rd party APIs. (You can use free usage plan)

- OpenWeatherMap REST API: https://openweathermap.org/api/one-call-api
  - Please use **daily** weather information
- Giphy REST API: https://developers.giphy.com/docs/api#quick-start-guide
  - APIs for fetching GIF images based on a given query or tag 

### Persistence Layer:

Use an In-Memory DB (e.g. H2) for caching responses of your service
- If the client calls your API for the **same** `longitude / latitude` on the same day (`dd-mm-yyyy`) then you can return data from DB instead of making calls to 3rd-party APIs

- **Hint**: (Optional) You can use geohash function (https://en.wikipedia.org/wiki/Geohash) to calculate a hash value for a given pair of `longitude/latitude`. It will help you to retrieve data from database by date(`dd-mm-yyy`) and location(`geohash` value) 

### Requirements
- Readme: How to build/run
- Depending on the applied position requirements, please choose your language: Java, Kotlin/Spring Boot 2, NodeJs/NestJs, Python 
- Configuration should be in a separate file. 
- Unit tests 
- Integration tests (No real API calls should be triggered to third party services when running the tests)

### Nice to Have
- Docker


