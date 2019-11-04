const todos =  [
    {
      id: 1,
      title: "lunch",
      description: "Go for lunc by 2pm"
    }
];

const users = [
    {
        id : 0,
        created : '2019-09-03T23:09:48+00:00',
        userName : 'JohnGoodman',
        password : 'test',
        latitude : 1,
        longitude : 1,
        pic : 'https://upload.wikimedia.org/wikipedia/commons/8/89/John_Goodman_at_Governors_Ball_1993.jpg'
    },
    {
        id : 1,
        created : '2019-09-03T23:09:49+00:00',
        userName : 'RMcAdams',
        password : 'test',
        latitude : 1,
        longitude : 1,
        pic : 'https://en.wikipedia.org/wiki/Rachel_McAdams#/media/File:Rachel_McAdams,_2016_(cropped).jpg'
    }
];

const statuses = [
    {
        id : 0,
        activityId : 2,
        userId: 0,
        active : true,
        passive : true,
        lastModified : '2019-09-03T23:09:58+00:00',
        description : 'Nine ball anyone?'
    },
    {
        id : 1,
        activityId : 0,
        userId: 0,
        active : false,
        passive : true,
        lastModified : '2019-09-03T23:09:58+00:00',
        description : 'Always up for a show!'
    }
]

const matches = [
    {
        id : 0,
        matchDate : '2019-09-03T23:10:38+00:00',
        user1 : 0,
        user2 : 1
    }
]

const messages = [
    {
        id : 0,
        userId : 0,
        matchId : 0,
        createDate : '2019-09-03T23:09:58+00:00',
        text : 'Nine ball anyone?'
    },
    {
        id : 1,
        userId : 1,
        matchId : 0,
        createDate : '2019-09-03T23:10:59+00:00',
        text : 'I\'m game!'
    }
]

const activities = [
    {id: 0, key: '0', title: 'ART', description: '', status: 'off', explanation: 'Have a new exhibit folks should check out? Need volunteers to make your work a reality? Looking for a critic, a mentor or just a fresh perspective? Do you love art? Post or reply to an art event!'},
    {id: 1, key: '1', title: 'BASKETBALL', description: '', status: 'off', explanation: 'One on one? Three on three? Horse? Friendly pick up game? Just plain like watching folks shoot hoops? Post or reply to a basketball invitation!'},
    {id: 2, key: '2', title: 'BILLIARDS', description: '', status: 'off', explanation: 'Eight Ball? Nine Ball? Three Ball? Cut-Throat? Need some pointers? Like to teach beginners? Shoot some pool with a billiards invitation!'},
    {id: 3, key: '3', title: 'BOARD GAMES', description: '', status: 'off', explanation: 'Scrabble? Settlers of Catan? Monopoly? You name it! Tell folks what board game you\'re playing or reply to a posted board game invitation!'},
    {id: 4, key: '4', title: 'CARDS', description: '', status: 'off', explanation: 'Poker? Rummy? Bridge? Go Fish? Tell folks what card game you\'re playing or reply to a posted card game invitation!'},
    {id: 5, key: '5', title: 'CHARITY', description: '', status: 'off', explanation: 'Need volunteers to support a good cause? Want to spend some time helping others? Post or reply to a charity volunteering opportunity!'},
    {id: 6, key: '6', title: 'CHESS', description: '', status: 'off', explanation: 'A game so great it needed its own category! Want to teach a beginner? Want to learn some tips? Looking for some fresh competition? Want to challenge a master? Post or reply to a chess invitation!'},
    {id: 7, key: '7', title: 'D&D', description: '', status: 'off', explanation: 'Searching for that rogue to round out your party? Want to try a one shot with a brand new DM? Want to sit in on a campaign for a single session then go out in a blaze of glory? Break out the dice and post or reply to a D&D invitation!'},
    {id: 8, key: '8', title: 'DARTS', description: '', status: 'off', explanation: '301? Around the world? A friendly game of Bullseye? Throw out or reply to a darts invitation!'},
    {id: 9, key: '9', title: 'DOMINOS', description: '', status: 'off'},
    {id: 10, key: '10', title: 'FOOD', description: '', status: 'off', explanation: 'Looking for folks to join your pot-luck barbeque? Have some leftovers you\'re not in the mood for? Need a taste tester, food critic or sampler? ...Hungry? Post or reply to a food invitation!'},
    {id: 11, key: '11', title: 'FOOTBALL', description: '', status: 'off'},
    {id: 12, key: '12', title: 'GO', description: '', status: 'off'},
    {id: 13, key: '13', title: 'MAGIC CARDS', description: '', status: 'off'},
    {id: 14, key: '14', title: 'MUSIC', description: '', status: 'off', explanation: 'Looking for a trumpet player to sit in with the band? Throwing a gig? Busking? Touring? Critiquing? Scouting? Recording? Just want to jam with some new folks? Post or reply to a music invitation!'},
    {id: 15, key: '15', title: 'PING PONG', description: '', status: 'off'},
    {id: 16, key: '16', title: 'PERFORMANCE', description: '', status: 'off', explanation: 'Looking for an audience? Need to find an actor? Want folks to know about your cool street performance? Just feel like watching a show? Post or reply to a performance event!'},
    {id: 17, key: '17', title: 'POKEMON GO', description: '', status: 'off'},
    {id: 18, key: '18', title: 'PROMOTION', description: '', status: 'off', explanation: 'Having a sale? New item on the menu? Looking for the latest limited time deals? Post or reply to a promotion event!'},
    {id: 19, key: '19', title: 'RUNNING', description: '', status: 'off'},
    {id: 20, key: '20', title: 'SHUFFLEBOARD', description: '', status: 'off'},
    {id: 21, key: '21', title: 'SOCCER', description: '', status: 'off'},
    {id: 22, key: '22', title: 'TENNIS', description: '', status: 'off'},
    {id: 23, key: '23', title: 'WORK', description: '', status: 'off', explanation: 'Need some work done? Want to make some cash? Tell folks what you need done or reply to a posted job offer!'}
  ];

export default {todos, users, statuses, matches, messages, activities};