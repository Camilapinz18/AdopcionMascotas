const app = Vue.createApp({
  data () {
    return {
      users: [],
      availablePets: [
        {
          name: 'Pancho',
          specie: 'dog',
          breed: 'creole',
          gender: 'male',
          color: 'black',
          age: '6',
          description: 'Funny',
          image: './images/perro1.jpg',
          status: 'available'
        },
        {
          name: 'Tata',
          specie: 'dog',
          breed: 'creole',
          gender: 'female',
          color: 'Brown',
          age: '6',
          description: 'Funny',
          image: './images/perro2.jpg',
          status: 'available'
        },
        {
          name: 'Poli',
          specie: 'dog',
          breed: 'creole',
          gender: 'female',
          color: 'white',
          age: '6',
          description: 'Funny',
          image: './images/perro3.jpg',
          status: 'available'
        }
      ],
      adoptedPets: [],
      username: null,
      password: null,
      isLogin: false,
      isLandPage: false,
      isGiveForAdoption: false,
      isAdminList: false,
      isPetList: false,
      currentUser: null,
      name: null,
      breed: null,
      color: null,
      age: null,
      specie: null,
      gender: null,
      description: null
    }
  },
  methods: {
    async fetchUsers () {
      // if (this.users.length <= 15 && this.users.length > 1) {
      //   console.log('Ya hay usuarios')
      // } else if (this.users.length < 1) {
      //   await fetch('https://randomuser.me/api/?results=15')
      //     .then(response => response.json())
      //     .then(data =>
      //       data.results.map(user => {
      //         this.users.push({
      //           photo: user.picture.thumbnail,
      //           name: `${user.name.first + ' ' + user.name.last}`,
      //           age: user.dob.age,
      //           country: `https://countryflagsapi.com/png/${user.location.country}`,
      //           email: user.email,
      //           phone: user.cell,
      //           username: user.login.username,
      //           password: user.login.password,
      //           gender: user.gender
      //         })
      //       })
      //     )
      //   //this.getCountryFlag()
      //   localStorage.setItem('users', JSON.stringify(this.users))

      //   console.log('length', this.users.length)
      // }
      console.log('estoy en fetch users')

      try {
        const response = await fetch('https://randomuser.me/api/?results=10')
        const users = await response.json()
        //console.log(users.results, 'users')

        users.results.map(user => {
          this.users.push({
            name: user.name.first + user.name.last,
            phone: user.cell,
            email: user.email,
            gender: user.gender,
            username: user.login.username,
            password: user.login.password,
            role: this.assignRandomRole()
          })
        })

        localStorage.setItem('users', JSON.stringify(this.users))
      } catch (error) {
        console.log(error)
      }
    },

    assignRandomRole () {
      const roles = ['client', 'admin']
      let randNumber = Math.round(Math.random() * 1)

      if (randNumber === 0) {
        return 'admin'
      } else {
        return 'client'
      }
    },
    login () {
      console.log('LOGINM', this.username, this.password)
      if (
        this.username === '' ||
        this.username === undefined ||
        this.username === null ||
        this.password === '' ||
        this.password === undefined ||
        this.password === null
      ) {
        alert('you must fill all the fields to continue')
      } else {
        const userExists = this.users.find(user => {
          return user.username == this.username
        })
        if (userExists) {
          if (this.password === userExists.password) {
            console.log(userExists.role, 'ROLE')
            if (userExists.role === 'admin') {
              this.currentUser = userExists
              this.isLogin = false
              this.isLandPage = true
              this.isAdminList = true
              console.log('isAdminList', this.isAdminList)
            } else if (userExists.role === 'client') {
              this.currentUser = userExists
              this.isLogin = false
              this.isLandPage = true
            }
          } else {
            alert('wrong password')
          }
        } else {
          alert('user doenst exists')
        }
      }

      localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
    },
    checkIfUserLogged () {
      const isUserLogged = JSON.parse(localStorage.getItem('currentUser'))
      if (isUserLogged) {
        this.currentUser = isUserLogged
        this.isLogin = false
        this.isLandPage = true
      } else {
        this.isLogin = true
        this.isLandPage = false
      }

      //console.log(this.currentUser,"current")
    },
    logout () {
      const confirmLogout = confirm('Are yoo sure you want to logout?')

      if (confirmLogout) {
        localStorage.removeItem('currentUser')
        this.isLandPage = false
        this.isLogin = true
      }
    },
    giveForAdoption () {
      console.log('give')

      this.isGiveForAdoption = !this.isGiveForAdoption
    },
    addPet () {
      console.log('add')
      if (
        this.name === '' ||
        this.name === undefined ||
        this.name === null ||
        this.breed === '' ||
        this.breed === undefined ||
        this.breed === null ||
        this.specie === '' ||
        this.specie === undefined ||
        this.specie === null ||
        this.color === '' ||
        this.color === undefined ||
        this.color === null ||
        this.age === '' ||
        this.age === undefined ||
        this.age === null ||
        this.gender === '' ||
        this.gender === undefined ||
        this.gender === null ||
        this.description === '' ||
        this.description === undefined ||
        this.description === null
      ) {
        alert('you must fill all the fields to continue')
      } else {
        this.availablePets.push({
          name: this.name,
          specie: this.specie,
          breed: this.breed,
          gender: this.gender,
          color: this.color,
          age: this.age,
          description: this.description,
          image: './images/perro2.jpg',
          status: 'available'
        })

        alert('Pet added correctly')
        console.log('PETS', this.availablePets)
        localStorage.setItem('pets', JSON.stringify(this.availablePets))
      }
    },
    syncLocalStorage () {
      if (
        localStorage.getItem('pets') === null ||
        localStorage.getItem('pets') === undefined
      ) {
        localStorage.setItem('pets', JSON.stringify(this.availablePets))
      } else {
        localStorage.setItem('pets', localStorage.getItem('pets'))
        const toUpdatePets = JSON.parse(localStorage.getItem('pets'))
        this.availablePets = toUpdatePets
      }
    },
    showAdopt () {
      this.isPetList = !this.isPetList
    },
    adopt (pet) {
      const result = confirm('Are you sure you want to adopt this pet?')

      console.log('PETTT', pet)
      if (result) {
        const adoptedPet = this.availablePets.find(petAvailable => {
          return petAvailable.name === pet.name
        })

        adoptedPet.status = 'adopted'

        this.adoptedPets.push(adoptedPet)

        console.log('adoptedPetsss', this.adoptedPets)
        localStorage.setItem('adoptedPets', JSON.stringify(this.adoptedPets))
        this.availablePets = this.availablePets.filter(petAvailable => {
          return petAvailable.name !== pet.name
        })

        localStorage.setItem('pets', JSON.stringify(this.availablePets))
      }
    }
  },

  created () {
    this.isLogin = true
    this.fetchUsers()
    this.checkIfUserLogged()
    this.syncLocalStorage()
  }
})

app.mount('#app')
