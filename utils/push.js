const apn = require('apn')
const path = require('path');
const dayjs = require('dayjs');

function message(mode, user, course)
{
  const { userName } = user
  const { courseName, courseTime, date } = course

  if (process.env.LANGUAGE === 'kor')
  {
    const now = dayjs().format("HH시 MM분")
    switch (mode)
    {
      case status.onBoard:
          return `${userName}님 께서 ${now}, ${courseName}행 차량에 탑승하셨습니다`

      case status.arrivedHome:
          return `${userName}님 께서 ${now}, ${courseName}행 차량에서 하차하셨습니다`
    
    }
  }
  else
  {
    const now = dayjs().format("HH:MM")
    switch (mode)
    {
      case status.onBoard:
          return `${userName} boarded on the bus bound for ${courseName}`
        
      case status.arrivedHome:
          return `${userName} got off from the bus`
    }
  }

  return "dummy"
}


async function sendPush(message, deviceToken = process.env.DEVICE_TOKEN)
{
  var option = {
    token: {
      key: path.join(__dirname, process.env.KEY_PATH), 
      keyId: process.env.KEY_ID,
      teamId: process.env.TEAM_ID
    },

    production: false
  }

  let apn_provider = new apn.Provider(option)

  var note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600;
  note.badge = 1;
  note.sound = "ping.aiff";
  note.alert = message
  note.payload = {"messageFrom": "MovSe"}
  note.topic = process.env.BUNDLE_ID

  const result = await apn_provider.send(note, process.env.DEVICE_TOKEN)
  return result
}

const status = {
  beforeStart: 0, // 운행 시작 전
  start: 1, // 운행 시작
  onBoard: 2, // 탑승 완료
  arrivedCourseAttraction: 3, // 남산타워 도착 
  arrivedHome: 4, // 하차 완료
  noShow: 5, // 노쇼
  end: 6, // 여행 일정 모두 종료 
}

module.exports = {
  sendPush,
  status,
  message
}