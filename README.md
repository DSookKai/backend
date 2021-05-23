# Moving Citizen Center - Backend

Node.js/Express Backend for **Junction X Seoul 2021**with **AutoCrypt**

[API Description](https://www.notion.so/API-796bb092075f4c41a6c8d1df1d6fc48a) (Korean)

### Steps to reproduce

1. Get `.p8` key file from [Apple developer website](https://developer.apple.com/account/resources/)
2. Fill out .env file to provide proper environmental variables in `.env.example`
    - DEVICE_TOKEN
        - Sample device token for push notification test
    - KEY_ID
        - Key id to send push notification
    - KEY_PATH
        - Key file to send push notification
        - `path/to/APNsAuthKey_XXXXXXXXXX.p8`
    - AZURE_KEY
        - Refer to [Microsof Azure Document](https://docs.microsoft.com/ko-kr/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-entity-linking?tabs=version-3-preview) to get your key
    - AZURE_ENDPOINT
        - Refer to [Microsof Azure Document](https://docs.microsoft.com/ko-kr/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-entity-linking?tabs=version-3-preview) to get proper endpoint
    - TEAM_ID
        - Developer team id to send push notification
    - BUNDLE_ID
        - Bundle identifier of IOS frontend
    - LANGUAGE
        - `kor` or `eng` to change language preference
3. Install dependencies

    ```bash
    npm i
    ```

4. Run the server

    ```bash
    npm run dev
    ```