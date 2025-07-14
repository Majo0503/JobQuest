class user:
    def __init__(self, code, nameUser, lastName, phone, birthDate, gender, dpi, rol, email, password, laboralData, educationData, status, createDate, modificationDate):
        self.code = code
        self.nameUser = nameUser
        self.lastName = lastName
        self.phone = phone
        self.birthDate = birthDate
        self.gender = gender
        self.dpi = dpi
        self.rol = rol
        self.email = email
        self.password = password
        self.laboralData = laboralData
        self.educationData = educationData
        self.status = status
        self.createDate = createDate
        self.modificationDate = modificationDate


class company:
    def __init__(self, code, nameCompany, direction, phone, nit, environment, sector, email, date, description, status, managerRH, state):
        self.code = code
        self.nameCompany = nameCompany
        self.direction = direction
        self.phone = phone
        self.nit = nit
        self.environment = environment
        self.sector = sector
        self.email = email
        self.date = date
        self.description = description
        self.status = status
        self.managerRH = managerRH
        self.state = state


class permit:
    def __init__(self, code, administrator, recruiter, employee, createDate, modificationDate):
        self.code = code
        self.administrator = administrator
        self.recruiter = recruiter
        self.employee = employee
        self.createDate = createDate
        self.modificationDate = modificationDate
