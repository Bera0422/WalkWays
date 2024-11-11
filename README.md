# WalkWays
### Ahmed Bera Pay

## Summary of Project

 This project develops a cross-platform mobile app enhancing the casual walking experience. Unlike apps for competitive sports or hiking, WalkWays offers curated, user-friendly urban walking routes with local safety, accessibility, and scenery feedback. By catering to casual walkers and tourists alike, it creates a richer, more enjoyable walking experience, encouraging both physical and mental health. The app fosters micro-communities centered around shared walking paths while offering curated routes for first-time visitors or explorers.

# Project Analysis

## Value Proposition

WalkWays addresses a gap in existing apps, which tend to focus on
athletic or hiking routes rather than leisurely, casual walking. Many
people, including tourists, walk for relaxation or exploration but lack
a tool tailored to their needs. According to Walking for Leisure and
Transportation Among Adults: United States, 2022 by the Centers for
Disease Control and Prevention (CDC), about 60% of U.S. adults walk for
leisure weekly, while Europe's rich pedestrian culture is central to
urban life and tourism. European cities, known for their walkable
streets, attract millions of tourists, making WalkWays ideal for
travelers exploring by foot. It targets this underserved demographic
with a simple, intuitive app. Casual walkers will enjoy accessible,
scenic, and safe routes while also building connections with local
communities or tourists sharing the same routes.

<img width="390" alt="resim" src="https://github.com/user-attachments/assets/2643ddb2-8082-45c9-b097-b16a813b5b6c">


## Primary Purpose

The main focus of this application is to help casual walkers track their
walking routes and explore new ones, either within their neighborhood or
in unfamiliar places. By offering curated routes that integrate local
feedback on safety, accessibility, and scenic beauty, the app encourages
consistent walking habits that benefit both physical and mental
well-being. Additionally, it fosters micro-communities, promoting social
engagement by enabling users to share routes and experiences with
like-minded walkers.

## Target Audience

The target audience includes casual walkers and tourists, primarily aged
18-44. As per the CDC, 61.8% of adults in this age group walk for
leisure, highlighting their interest in non-competitive, enjoyable
walking experiences. This demographic is also drawn to urban
exploration, particularly in European cities where walking is integral
to both daily life and tourism. The app's focus on accessible and scenic
routes will make it particularly appealing to this group. To reach this
demographic, WalkWays will employ social media marketing, influencer
campaigns, and partnerships with local businesses or tourism boards.

## Success Criteria

Success will be measured mainly by user engagement, route feedback, and community activity metrics. Financial success will be measured from freemium subscriptions and non-intrusive ads, while partnerships with businesses (e.g., sponsored routes) can open further monetization opportunities in the future. User satisfaction metrics from app reviews and retention rates will provide additional success markers. 

## Competitor Analysis

This application has many competitors, including **Strava** and
**AllTrails**. While these apps dominate fitness and hiking markets,
WalkWays differentiates itself by focusing exclusively on urban, casual
walkers. Strava\'s strengths lie in tracking athletic activities, but it
overwhelms casual users with features and data aimed at athletes.
AllTrails focuses heavily on nature and hiking trails, with limited
relevance for urban walkers or tourists. WalkWays stands out by
providing accessible, curated city routes with an emphasis on ease and
enjoyment, creating a more engaging experience for non-competitive
walkers, with community and feedback loops as its strengths.

## Monetization Model

WalkWays will use a freemium model, offering basic routes and walking
features for free, with a premium subscription unlocking personalized
route recommendations, exclusive walking tours, and maybe additional
social features. In-app ads will be the main source of income for the
free version. Future versions may introduce sponsored routes or premium,
curated walking experiences.

# Initial Design

**Minimum Viable Product (MVP)**  

[View the detailed MVP](MVP.md)

The MVP will deliver core functionality aimed at providing a meaningful
walking experience for casual walkers and tourists. The key features
are:

1.  **Curated and User-Generated Routes with Tracking**: The app will
    offer pre-defined walking routes in select cities, focusing on
    accessibility, safety, and scenic value. Users can also generate and
    track their own routes using GPS and share feedback on these routes
    with the community. Basic tracking features will be included, such
    as distance walked, time spent walking, and step count, with minimal
    metrics to avoid overwhelming casual users.

2.  **Micro-Community Interaction**: Users will be able to engage with a
    local walking community, sharing feedback on routes, rating walks,
    and making route suggestions. This feature will allow casual walkers
    to connect without competitive pressure and will focus on building
    positive community experiences.

3.  **Feedback Mechanism**: Users can provide feedback on route safety,
    accessibility, and scenic enjoyment, which will feed into improving
    future route suggestions. This ensures a user-driven experience,
    adapting routes to real-time community feedback.

**Scope**

- The app will initially focus on a few cities in the USA or Europe,
  where walking culture is prevalent and routes are available.

- **Advanced Features** like personalized recommendations or
  algorithm-based suggestions will not be part of the MVP and may be
  included in future versions.

**Limitations**

- **Geographic Scope**: Limited city coverage, starting with a small set
  of key cities.

- **No Offline Support**: Users will need an active internet connection
  to access routes and maps.

- **Basic Social Features**: Full social interaction features (e.g.,
  in-app messaging) will be deferred until later versions.

- **Curation and Suggestions**: Very few and simple methods will be used
  for route curation and suggestion without complicated algorithms.

## UI/UX Design

The main screens and components can be described as follows:

- **Home Screen**: Provides easy access to curated routes and a search
  bar for custom route exploration.

- **Route Map**: Displays the route visually, with safety and scenic
  ratings.

- **Tracking Interface**: Minimalistic design for tracking walking
  statistics (map view, distance, steps, etc.).

- **Community Feedback Tab**: Allows users to view ratings and leave
  feedback on routes, fostering interaction and continuous improvement.

Initial sketches for the UI:

<img width="417" alt="resim" src="https://github.com/user-attachments/assets/479e7e4c-9ccc-44e8-a9a1-3ce6768e4ec4">

Initial Mockup for the UI:

[WalkWays Initial Mockup](https://github.com/user-attachments/files/17537590/WalkWays.Initial.Mockup-6.pdf)


## Technical Architecture

- **Frontend**: **React Native** for cross-platform support (iOS and
  Android).

<!-- -->

- **Backend**:

- **Firebase** for data storage, real-time user updates, and handling
  user-generated content like routes and feedback.

- **Google Maps API** for real-time walking route generation and live
  mapping.

<!-- -->

- **Core Data Structures**:

  - **Route Data**: Information about routes, location, user ratings,
    and feedback.

  - **User Profiles**: For storing user preferences and walking history.

  - **Feedback Data**: Collection of community feedback for route
    improvements.

  - **Communities**: For storing user groups and interactions between
    them

<!-- -->

- **3rd Party Services**:

  - **Google Maps API** for navigation and route information.

  - **Firebase Authentication** for secure user logins.

  - **Social Media APIs (Optional)** for sharing routes.

 The measure of success will mainly depend on the ease of data transfer and the reliability of the services provided. Although it has less importance for earlier versions, scalability will be another success criterion in the future. As intuitiveness matters in this application, the seamlessness of the 3rd-party integrations will also be a point to determine the success of the technical architecture. Success in the design of data structures and storage can be measured by how easy it is to add or remove feedback mechanisms.

# Challenges and Open Questions

- **GPS Usage and Access**: Accessing GPS data presents a technical
  challenge. Additionally, GPS tracking may drain battery life, and
  acquiring permissions for location tracking will also be a challenge.
  Solutions may include using intermittent GPS updates or location
  snapshots to conserve battery. There will be a need to implement clear
  consent prompts and prioritize privacy.

<!-- -->

- **Data Accuracy**: Ensuring up-to-date information on route safety and
  accessibility could be challenging. This may require frequent updates
  or user feedback loops to maintain accuracy.

- **Community Feedback Integration**: Encouraging users to provide
  useful route feedback without overwhelming them with too many
  questions is another challenge. A simplification of the feedback
  mechanism to quick rating systems (1-5 stars) with optional short
  comments can ensure ease of use and higher engagement.

- **Integration with APIs and 3rd Party Dependencies**: Achieving
  seamless integration with mapping and cloud services can be
  challenging. Choosing simpler and lightweight technologies and
  conducting comprehensive research to determine capabilities and
  limitations may facilitate this process.

**Open questions:**

- What is the most efficient way to gather community feedback on routes
  without overwhelming users?

- Should premium route recommendations be algorithmic or
  community-driven?

- How should data accuracy be ensured?
