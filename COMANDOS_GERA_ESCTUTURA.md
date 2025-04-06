### GERAR MODULOS, CONTROLE E SERVICES (Passo 01)

- nest g module <nome>
- nest g service <nome>
- nest g controller <nome>


### ADICIONAR O MODELO DE PRISMA NO schema.prisma (Passo 02)

- model<nome> {
    id String @id @default(uuid())
    name String 
    city String
    color1 String
    color2 String? 
    creatdAt DateTime @default(now())  
  }

  - Após criado roda-se o seguinte:
    - npx prisma migrate dev --name <name>
    - npx prisma gerate

### APÓS VAMOS CRIAR O ARQUIVO DTO QUE NADA MAIS É DO QUE A INTEFACE (Passo 03)

- export class CreateTeamDto {
  name: string;
  city: string;
  color1: string;
  color2?: string;
}

### APÓS VAMOS CRIAR A FUNCIONALIDADE DA SERVICE (Passo 04)

### APÓS VAMOS CRIAR AS ROTAS NO CONTROLLER (Passo 05)

  