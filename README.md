<p align="center"><a href="https://www.codechefvit.com" target="_blank"><img src="https://i.ibb.co/4J9LXxS/cclogo.png" width=160 title="CodeChef-VIT" alt="CodeChef-VIT"></a>
</p>

<h2 align="center"> Clueminati 2.0 </h2>
<br/>

> <p>Clueminati is CodeChef VIT's annual treasure hunt event, returning for its second edition in 2024. This web application facilitates team creation, score tracking, and real-time leaderboard management, providing participants with a seamless and engaging experience throughout the competition. 

</p>

## 🌐 Deploy

[https://clueminati24.codechefvit.com](https://clueminati24.codechefvit.com)

## ⚙️ Tech Stack:

- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hot Toast](https://react-hot-toast.com)
- [Axios](https://axios-http.com)
- [Shadcn](https://ui.shadcn.com)
- [NeonDB](https://neon.tech)

## 💡 Features:

- Admin access to oversee and manage teams, monitor scores, and handle leaderboard updates efficiently.
- You can either join a team or create a new one with just a few clicks.
- A dynamic leaderboard.
- A fully functional portal with support for gestures and compatibility across devices with varying screen resolutions.


## 🖼 Screenshots

<table>
  <tr>
    <td align="center">
      <img src="public/login.jpeg" alt="Login" width="300"/>
      <br/>
      <p>Login Page</p>
    </td>
    <td align="center">
      <img src="public/join.jpeg" alt="Join" width="300"/>
      <br/>
      <p>Join Team</p>
    </td>
    <td align="center">
      <img src="public/create.jpeg" alt="Create" width="300"/>
      <br/>
      <p>Create Team</p>
    </td>
  </tr>

  <tr>
      <td align="center">
      <img src="public/share.jpeg" alt="Share" width="300"/>
      <br/>
      <p>Share Team Code</p>
    </td>
    <td align="center">
      <img src="public/dashboard.jpeg" alt="Dashboard" width="300"/>
      <br/>
      <p>Dashboard</p>
    </td>
    <td align="center">
      <img src="public/leaderboard.jpeg" alt="Leaderboard" width="300"/>
      <br/>
      <p>Leaderboard</p>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="public/profile.jpeg" alt="Profile" width="300"/>
      <br/>
      <p>View Profile</p>
    </td>
    <td align="center">
      <img src="public/post-start.jpeg" alt="Post Start" width="300"/>
      <br/>
      <p>Dashboard (Event live)</p>
    </td>
    <td align="center">
      <img src="public/admin-profile.jpeg" alt="Admin Profile" width="300"/>
      <br/>
      <p>Admin Profile</p>
    </td>
  </tr>

  <tr>
    <td align="center">
    </td>
    <td align="center">
      <img src="public/score.jpeg" alt="Score" width="300"/>
      <br/>
      <p>Score Update</p>
    </td>
	<td align="center">
    </td>
  </tr>
</table>


## 🏁 Get Started

1) To get started, fork your own copy and clone the main branch. To clone a branch you can run the following:
```bash
git clone -b main https://github.com/<Your username>/clueminati-portal-2.0.git
```

Run these commands on your bash/terminal and open it in a code editor of your choice.

2) Run the following to install all the dependencies:

```bash
pnpm i
```

3. Initialize environment variables and set up a PostgreSQL database using NeonDB. Update the database URL with the connection string and run the following command to set-up your database schema:
```bash
pnpm db:migrate
```


4) To start your development server run:

```bash
pnpm dev
```

## 📝 Note:
- Make sure you set the user role as 'admin' in database to access all the admin specific APIs.
- For detailed API specifications, including routes, request formats, and response examples, please refer to the documentation [here](https://documenter.getpostman.com/view/25706513/2sAXqp83bu).



## 🚀 Contributors

<table>
<tr align="center">
	<td>
	<p align="center">
		<img src = "https://avatars.githubusercontent.com/u/91564450?v=4" width="200" height="200" alt="Aaditya" style="border: 2px solid grey; width: 170px; height: 170px">
	</p>
	<p style="font-size:17px; font-weight:600;">Aaditya Mahanta</p>
	<p align="center">
		<a href = "https://github.com/aditansh"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="GitHub"/></a>
		<a href = "https://www.linkedin.com/in/aadityamahanta/">
			<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
		</a>
	</p>
  </td>
  
<td>
	<p align="center">
		<img src = "https://avatars.githubusercontent.com/u/84934511?v=4" width="200" height="200" alt="profilepic" style="border: 2px solid grey; width: 170px; height:170px">
	</p>
	<p style="font-size:17px; font-weight:600;">Nishant Gupta</p>
	<p align="center">
		<a href = "https://github.com/NishantGupt786"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="GitHub"/></a>
		<a href = "https://www.linkedin.com/in/nishant-gupta-12913221b/">
			<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
		</a>
	</p>
</td>

<td>
	<p align="center">
		<img src = "https://avatars.githubusercontent.com/u/56132559?v=4" width="200" height="200" alt="profilepic" style="border: 2px solid grey; width: 170px; height:170px">
	</p>
	<p style="font-size:17px; font-weight:600;">Abhinav Ganeshan</p>
	<p align="center">
		<a href = "https://github.com/Abh1noob"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="GitHub"/></a>
		<a href = "https://www.linkedin.com/in/abhinav-gk/">
			<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
		</a>
	</p>
</td>
</tr>

<tr align="center">
<td>
	<p align="center">
		<img src = "https://avatars.githubusercontent.com/u/64064721?v=4" width="200" height="200" alt="profilepic" style="border: 2px solid grey; width: 170px; height:170px">
	</p>
	<p style="font-size:17px; font-weight:600;">Heet Jatania</p>
	<p align="center">
		<a href = "https://github.com/AqViolet"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="GitHub"/></a>
		<a href = "https://www.linkedin.com/in/heet-jatania-4a1294275/">
			<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
		</a>
	</p>
</td>

<td>
	<p align="center">
		<img src = "https://avatars.githubusercontent.com/u/157038896?v=4" width="200" height="200" alt="profilepic" style="border: 2px solid grey; width: 170px; height:170px">
	</p>
	<p style="font-size:17px; font-weight:600;">Aditi Saxena</p>
	<p align="center">
		<a href = "https://github.com/aditisaxena259"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="GitHub"/></a>
		<a href = "https://www.linkedin.com/in/aditi-saxena-4674ab222/">
			<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
		</a>
	</p>
</td>

<td>
	<p align="center">
		<img src = "https://avatars.githubusercontent.com/u/162618504?v=4" width="200" height="200" alt="profilepic" style="border: 2px solid grey; width: 170px; height:170px">
	</p>
	<p style="font-size:17px; font-weight:600;">Ruhi Doshi</p>
	<p align="center">
		<a href = "https://github.com/ruhi-doshi"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="GitHub"/></a>
		<a href = "https://www.linkedin.com/in/ruhi-doshi-69542628b/">
			<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="LinkedIn"/>
		</a>
	</p>
</td>
</tr>
</table>

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

<p align="center">
	Made with :heart: by <a href="https://www.codechefvit.com" target="_blank">CodeChef-VIT</a>
</p>
