import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main(){const r=await p.distribution.findMany({where:{active:true},include:{application:{select:{name:true}}}});r.forEach(d=>console.log(d.application.name,"|",d.type,"|",d.platform,"|",d.label,"|",d.url.slice(0,60)))}
main().finally(()=>p.$disconnect());
