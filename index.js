const app = Vue.createApp({
  data () {
    return {
      imagesToUploadDogs: [
        {
          url: './images/perro1.jpg',
          id: 1
        },
        {
          url: './images/perro2.jpg',
          id: 2
        },
        {
          url: './images/perro3.jpg',
          id: 3
        },
        {
          url: './images/perro4.png',
          id: 4
        }
      ],
      imagesToUploadCats: [
        {
          url: './images/gato1.jpg',
          id: 1
        },
        {
          url: './images/gato2.png',
          id: 2
        },
        {
          url: './images/gato3.jpg',
          id: 3
        },
        {
          url: './images/gato4.jpg',
          id: 4
        }
      ],
      users: [],
      availablePets: [
        {
          name: 'Pancho',
          specie: 'Perro',
          breed: 'Labrador',
          gender: 'Macho',
          color: 'Negro',
          age: '6',
          description: 'Divertido, muy activo, necesita de mucho ejercicio',
          image: './images/perro1.jfif',
          status: 'Disponible'
        },
        {
          name: 'Tata',
          specie: 'Perro',
          breed: 'Labrador',
          gender: 'Hembra',
          color: 'Negro',
          age: '6',
          description: 'Calmada, le gusta dormir, le gusta la compañia',
          image: './images/perro2.webp',
          status: 'Disponible'
        },
        {
          name: 'Poli',
          specie: 'Perro',
          breed: 'Crillo',
          gender: 'Hembra',
          color: 'Multicolor',
          age: '6',
          description: 'Activa, alerta, le gusta cuidar su territorio',
          image: './images/perro3.jpg',
          status: 'Disponible'
        },
        {
          name: 'Pepe',
          specie: 'Gato',
          breed: 'Criollo',
          gender: 'Macho',
          color: 'Amarillo',
          age: '6',
          description: 'Independiente, solitario',
          image: './images/gato1.jpg',
          status: 'Disponible'
        },
        {
          name: 'Luna',
          specie: 'Gato',
          breed: 'Criollo',
          gender: 'Hembra',
          color: 'Gris',
          age: '6',
          description: 'Le gusta la compañia, las caricias. Es muy cercana',
          image: './images/gato2.jfif',
          status: 'Disponible'
        },
        {
          name: 'Shaggy',
          specie: 'Perro',
          breed: 'Beagle',
          gender: 'Macho',
          color: 'Multicolor',
          age: '12',
          description: 'Muy activo, le gusta correr y morder cosas',
          image: './images/perro4.jpg',
          status: 'Disponible'
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
      isAdmin: false,
      name: null,
      breed: null,
      color: null,
      age: null,
      specie: null,
      gender: null,
      description: null,
      image: null
    }
  },
  methods: {
    async fetchUsers () {
      try {
        const response = await fetch('https://randomuser.me/api/?results=10')
        const users = await response.json()
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
    uploadImage () {
      if (
        this.specie === '' ||
        this.specie === undefined ||
        this.specie === null
      ) {
        Swal.fire(
          'Seleccione una especie',
          'Por favor seleccione una especie para continuar',
          'warning'
        )
      }
    },
    assignImage (image) {
      this.image = image
    },
    login () {
      if (
        this.username === '' ||
        this.username === undefined ||
        this.username === null ||
        this.password === '' ||
        this.password === undefined ||
        this.password === null
      ) {
        Swal.fire(
          'Datos incompletos',
          'Por favor completa todos los datos para iniciar sesión',
          'warning'
        )
      } else {
        const userExists = this.users.find(user => {
          return user.username == this.username
        })
        if (userExists) {
          if (this.password === userExists.password) {
            if (userExists.role === 'admin') {
              this.currentUser = userExists
              this.isLogin = false
              this.isLandPage = true
              this.isAdminList = true
              this.isAdmin = true
              this.isPetList = false
              this.isGiveForAdoption = false
            } else if (userExists.role === 'client') {
              this.currentUser = userExists
              this.isLogin = false
              this.isLandPage = true
              this.isPetList = true
              this.isAdmin = false
            }
            this.password = ''
            this.username = ''
          } else {
            Swal.fire(
              'Contraseña incorrecta',
              'Por favor verifica tu contraseña',
              'warning'
            )
          }
        } else {
          Swal.fire(
            'EL usuario no existe',
            'Por favor verifica que el usuario esté ingresado correctamente',
            'warning'
          )
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
        if (isUserLogged.role === 'admin') {
          this.isAdmin = true
          this.isAdminList = true
        } else if (isUserLogged.role === 'client') {
          this.isAdmin = false
        }
      } else {
        this.isLogin = true
        this.isLandPage = false
      }
    },
    logout () {
      Swal.fire({
        title: 'Estas seguro de cerrar sesión?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Salir',
        denyButtonText: `No salir`
      }).then(result => {
        if (result.isConfirmed) {
          localStorage.removeItem('currentUser')
          this.isLandPage = false
          this.isAdmin = false
          this.isAdminList = false
          this.isGiveForAdoption = false
          this.isPetList = false
          this.isLogin = true
        } else if (result.isDenied) {
        }
      })
    },
    giveForAdoption () {
      this.isPetList = false
      this.isAdminList = false
      this.isGiveForAdoption = true
    },
    addPet () {
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
        Swal.fire(
          'Diligencia el formulario',
          'Por favor diligencia el formulario en su totalidad para continuar',
          'warning'
        )
      } else {
        this.availablePets.push({
          name: this.name,
          specie: this.specie,
          breed: this.breed,
          gender: this.gender,
          color: this.color,
          age: this.age,
          description: this.description,
          image: this.image.url,
          status: 'Disponible'
        })
        Swal.fire(
          'Mascota añadida!',
          'Mascota añadida correctamente!',
          'success'
        )
        localStorage.setItem('pets', JSON.stringify(this.availablePets))
        this.specie = null
        this.name = null
        this.breed = null
        this.color = null
        this.age = null
        this.gender = null
        this.description = null
        this.image = null
      }
    },
    syncLocalStorage () {
      if (
        localStorage.getItem('pets') === null ||
        localStorage.getItem('pets') === undefined ||
        localStorage.getItem('adoptedPets') === null ||
        localStorage.getItem('adoptedPets') === undefined
      ) {
        localStorage.setItem('pets', JSON.stringify(this.availablePets))
        localStorage.setItem('adoptedPets', JSON.stringify(this.adoptedPets))
      } else {
        localStorage.setItem('pets', localStorage.getItem('pets'))
        const toUpdatePets = JSON.parse(localStorage.getItem('pets'))
        this.availablePets = toUpdatePets

        localStorage.setItem('adoptedPets', localStorage.getItem('adoptedPets'))
        const toUpdateAdoptedPets = JSON.parse(
          localStorage.getItem('adoptedPets')
        )
        this.adoptedPets = toUpdateAdoptedPets
      }
    },
    showAdopt () {
      this.isPetList = true
      this.isGiveForAdoption = false
      this.isAdminList = false
    },
    adopt (pet) {
      const result = Swal.fire({
        title: 'Vas a adoptar a esta mascota!',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Volver`
      }).then(result => {
        if (result.isConfirmed) {
          const adoptedPet = this.availablePets.find(petAvailable => {
            return petAvailable.name === pet.name
          })
          adoptedPet.status = 'Adoptado'
          this.adoptedPets.push(adoptedPet)
          localStorage.setItem('adoptedPets', JSON.stringify(this.adoptedPets))
          this.availablePets = this.availablePets.filter(petAvailable => {
            return petAvailable.name !== pet.name
          })
          localStorage.setItem('pets', JSON.stringify(this.availablePets))
          Swal.fire('Mascota adoptada!', '', 'success')
        } else if (result.isDenied) {
        }
      })
    },
    showAdminList () {
      this.isAdminList = true
      this.isGiveForAdoption = false
      this.isPetList = false
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
