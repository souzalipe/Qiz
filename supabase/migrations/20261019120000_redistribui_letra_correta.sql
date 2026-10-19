-- =============================================================================
-- Fase 5 — Redistribui a letra da resposta correta
--
-- Antes: a correta era B em 26 das 32 perguntas (e C nas outras 6) — um
-- padrão que um aluno atento percebe. Depois: 8 corretas em cada letra A–D.
-- "Não sei." continua sempre em E.
--
-- Só muda a coluna `ordem` (posição de cada alternativa); não mexe em texto
-- nem em `correta`. Posições definidas no fix_ordem.sql da pesquisa.
--
-- Por que em dois passos? A restrição unique (pergunta_id, ordem) não deixa
-- duas alternativas da mesma pergunta ocuparem a mesma posição nem por um
-- instante. Trocar posições uma a uma (ex.: B→C e C→B) bateria nessa regra.
-- Então: 1) move as alternativas para posições temporárias (11–15);
--        2) grava as posições finais (1–5);
--        3) confere que nenhuma ficou fora de 1–5 (se ficar, desfaz tudo).
-- =============================================================================

-- Passo 1: posições temporárias, longe de 1–5.
update public.alternativas
   set ordem = ordem + 10;

-- Passo 2: posições finais (a lista abaixo cobre as 160 alternativas).
update public.alternativas a
   set ordem = n.ordem
  from (values
  -- Q1: correta na letra C
  ('e3a61544-6476-544b-b563-cce041469558'::uuid, 1),
  ('cf05dedb-c685-5871-ae16-f159cbb96704'::uuid, 2),
  ('5a641e46-226c-5d42-8b49-3e8201c26576'::uuid, 3),
  ('104d2e47-199d-5678-9553-52b6865ce6d5'::uuid, 4),
  ('ab908182-9139-539b-b4d5-b62d35c7c0d3'::uuid, 5),
  -- Q2: correta na letra B
  ('16866555-34cf-5448-87cd-dc6101305372'::uuid, 1),
  ('fdd455a2-7e3d-540a-ad08-fff5c4f508ba'::uuid, 2),
  ('abbfecf5-fe0f-5089-948f-c3356b012847'::uuid, 3),
  ('b98d2f55-176c-5beb-b92a-f64e5e55bdc3'::uuid, 4),
  ('d52f5efb-962d-56ce-8ed9-43b361f356b6'::uuid, 5),
  -- Q3: correta na letra C
  ('cdaf128e-a40b-5d6f-ba00-a79cfa94d2e6'::uuid, 1),
  ('adc6e71e-0553-508d-84da-90fd8e93941b'::uuid, 2),
  ('e613ef64-ed0d-5099-b911-305db5234476'::uuid, 3),
  ('47fe2cfc-ce3c-5a65-acd5-d097f1fc8f89'::uuid, 4),
  ('a245ff42-428d-57ba-b14a-6f55fe24dc3a'::uuid, 5),
  -- Q4: correta na letra D
  ('793d1264-cadc-5f5f-b298-90af9a28cd1f'::uuid, 1),
  ('1dc2f488-615c-5fe9-8b02-d5f7f80f8170'::uuid, 2),
  ('f75c3880-0b6c-51a2-8e13-02ce20257edf'::uuid, 3),
  ('d871f72f-e46d-51a4-ba60-6740d90971b8'::uuid, 4),
  ('9e2f9d4c-2df1-57d4-8358-e57840d6ec0f'::uuid, 5),
  -- Q5: correta na letra B
  ('6fe065ea-526b-53ec-86d9-7178b3a65d54'::uuid, 1),
  ('fcb0c9ea-c03d-5892-a19a-85a71c2eb602'::uuid, 2),
  ('4790adf2-5d3c-5188-bd85-2d61a95a192e'::uuid, 3),
  ('0b38c47a-6276-5aee-84ad-f9537acd3bec'::uuid, 4),
  ('62014752-add6-5114-96f0-b81dfbcea6d8'::uuid, 5),
  -- Q6: correta na letra D
  ('a78903b4-b051-59f6-81e2-29d72e0785c4'::uuid, 1),
  ('162ebc70-a1cb-5120-9134-edbc9900301c'::uuid, 2),
  ('0ed76d1d-a4a9-5bda-948c-08d69a769343'::uuid, 3),
  ('4e863c7d-287a-5039-9241-35eea50b79bb'::uuid, 4),
  ('bfa0fdef-1968-5795-85cb-950929301d09'::uuid, 5),
  -- Q7: correta na letra C
  ('6f4a0522-1f2d-5bbd-a65e-1d52eb37119f'::uuid, 1),
  ('9b5acbca-1564-58a6-a786-2dd69633ef1b'::uuid, 2),
  ('605c82ed-c718-56be-b8c3-6331dad8f41d'::uuid, 3),
  ('2c928981-05d4-5001-9914-635024011c38'::uuid, 4),
  ('44db4bac-cba0-5a25-849a-47941e09b861'::uuid, 5),
  -- Q8: correta na letra C
  ('998f751e-a91a-5221-b97c-93477fba5675'::uuid, 1),
  ('270103c2-b523-588e-826c-50338f416390'::uuid, 2),
  ('e52a78aa-7730-565e-8a6a-87bae21703fd'::uuid, 3),
  ('ad02fca4-279d-5e84-bf9a-ffc1b3bca902'::uuid, 4),
  ('54932544-200c-54bb-87c0-70c48c06fca2'::uuid, 5),
  -- Q9: correta na letra D
  ('499c0675-da35-5c8c-921a-a23818fd4df7'::uuid, 1),
  ('3ddce842-4ea8-5252-a541-83eefa20ade6'::uuid, 2),
  ('76db75e0-b6bb-591a-a0b6-6e69ab8d4991'::uuid, 3),
  ('db70828e-6d7d-517b-a402-139c4a3c893d'::uuid, 4),
  ('5a4947d0-1726-555c-8e92-b79801baa499'::uuid, 5),
  -- Q10: correta na letra A
  ('8bccc91c-0652-54a6-82b8-b3c8565c1537'::uuid, 1),
  ('a780abdc-f0dc-5009-94b3-1a9e8427b41e'::uuid, 2),
  ('26a7f662-cac9-5077-a44c-a35c95cd29a0'::uuid, 3),
  ('c3b0c218-943f-57b5-898e-1a5d1ae67cf9'::uuid, 4),
  ('540481ba-fb30-5e8c-be26-2b09ab995638'::uuid, 5),
  -- Q11: correta na letra A
  ('c5778980-7bd0-5338-a76f-3975f42a3fcc'::uuid, 1),
  ('3500223d-dd6d-5f63-9499-9a1661005882'::uuid, 2),
  ('a4d328a6-a071-5ef7-be19-f85eb6942ee1'::uuid, 3),
  ('5cc6e7d8-cb23-54d0-a44d-277cf5e86e01'::uuid, 4),
  ('30754d90-ac6d-57f2-b781-a39a37267801'::uuid, 5),
  -- Q12: correta na letra B
  ('38ea9f6c-8458-528f-ae7d-7f492f5a576e'::uuid, 1),
  ('b585c2d7-c74a-5beb-8804-df397e322965'::uuid, 2),
  ('6c268fa5-5490-5465-94fd-9e88dd04d825'::uuid, 3),
  ('1857f371-81a4-52ac-ac1d-e89fc41fa028'::uuid, 4),
  ('0802dead-4287-562c-8401-5d62fdebdbe5'::uuid, 5),
  -- Q13: correta na letra A
  ('30206a4c-8350-5404-b1b8-a927f9476811'::uuid, 1),
  ('7f7c4916-057e-5554-9837-7de06219dbdf'::uuid, 2),
  ('e802f0db-8d33-5daa-a64c-e0169e75982f'::uuid, 3),
  ('a3ac8a3f-6591-573c-8b4a-920cb49c8c94'::uuid, 4),
  ('d9c7d513-e2aa-5521-b17e-f16f6de74a80'::uuid, 5),
  -- Q14: correta na letra C
  ('11586f4f-c4b5-5263-81f0-dc15a673cc93'::uuid, 1),
  ('cf9d67a2-be5c-59ea-b185-012d3762e5dc'::uuid, 2),
  ('b00beb42-e213-50df-88d1-e5adee1d7aa4'::uuid, 3),
  ('2afd2e91-fe45-5d7c-ba48-610068e5ba53'::uuid, 4),
  ('49c5c829-3e23-5724-bada-4177e620c21f'::uuid, 5),
  -- Q15: correta na letra A
  ('5472ec73-4736-5ad2-befe-cdd2cdb1cf57'::uuid, 1),
  ('afb52624-bba6-5fb0-a5fb-b138b21d5f17'::uuid, 2),
  ('02bda1ff-d0e5-5671-8114-21001a58cb1e'::uuid, 3),
  ('1a9409f1-1657-5a28-bf82-876f0ebb77a5'::uuid, 4),
  ('0de3e481-568d-5f94-a444-b695b5a4917d'::uuid, 5),
  -- Q16: correta na letra A
  ('346f019a-76e1-545b-b596-f3c989fd617a'::uuid, 1),
  ('898c5722-d4de-5640-83cd-bae6fe9ae1cd'::uuid, 2),
  ('b2dbd1b8-9716-5d80-9ef5-6e788e3772f0'::uuid, 3),
  ('28b7e7c7-9b2b-5b96-8607-4e0c1ab59003'::uuid, 4),
  ('8dd2d2f1-9aae-5831-a258-96c7b255121a'::uuid, 5),
  -- Q17: correta na letra C
  ('9ec3b50e-dd62-56ba-b45a-93bce1afb545'::uuid, 1),
  ('73aaaebc-3437-5917-a288-749a8a3b198e'::uuid, 2),
  ('810e0421-328a-52d5-bfcf-1b1d30985185'::uuid, 3),
  ('f55b306e-e5ce-5423-863d-8fcc13e6b2ad'::uuid, 4),
  ('9e139d08-4a6c-554a-9898-8bb89296601c'::uuid, 5),
  -- Q18: correta na letra B
  ('8811f453-ef02-55ce-9f03-3f5c1d3763a7'::uuid, 1),
  ('46324260-6d6e-5758-9184-896ef0a446a8'::uuid, 2),
  ('340b6ad4-ee48-504c-b926-60c8d8342ca6'::uuid, 3),
  ('69d5d2d4-bc0c-5eee-8807-e03393b4d142'::uuid, 4),
  ('e0fc5896-e0fb-50ea-854a-695c394ffa8c'::uuid, 5),
  -- Q19: correta na letra B
  ('d20352ab-6204-51ac-8397-51ff4ea9cebc'::uuid, 1),
  ('a9060618-a54e-5f92-b14b-c77a4e8e7d8b'::uuid, 2),
  ('78454ba6-143d-5108-8a9d-6c83686639a6'::uuid, 3),
  ('d5468657-9289-5534-bd95-fd1a43761231'::uuid, 4),
  ('f6344929-041f-5b40-89f0-4cfd13f0d2d5'::uuid, 5),
  -- Q20: correta na letra C
  ('ef76ce58-72c4-588b-8802-242c96733688'::uuid, 1),
  ('11c09da3-35e0-5096-98b7-e95fa2bdd7d3'::uuid, 2),
  ('30ca4f99-e04d-5959-8acc-3052a558e1a8'::uuid, 3),
  ('8646c976-5fc7-5c61-be34-41b4b6971509'::uuid, 4),
  ('120da4de-38c9-5cd1-b031-2191382ad64c'::uuid, 5),
  -- Q21: correta na letra C
  ('b67137c8-a8cf-524a-927d-b8dff8d65a48'::uuid, 1),
  ('01ad08a2-4e54-53e3-876f-9b91074baa6d'::uuid, 2),
  ('02433fd3-ee26-5b30-9e2d-ef923e0eb1d1'::uuid, 3),
  ('595e70f0-9517-52c2-812d-a13131da44aa'::uuid, 4),
  ('c2d78bcf-71e2-5b05-a366-813b3c1e18c2'::uuid, 5),
  -- Q22: correta na letra B
  ('f934c24c-9ad1-5342-bb65-5bb2f7765301'::uuid, 1),
  ('8e408cbc-cf68-50dd-908c-1a1f916c94bb'::uuid, 2),
  ('8c8ec4b5-65f7-5684-b005-93cd791394e2'::uuid, 3),
  ('6114e8ae-5281-5bee-a2db-84702a2fffb4'::uuid, 4),
  ('a056756c-b092-5e70-9cb9-084a2f1289a8'::uuid, 5),
  -- Q23: correta na letra B
  ('ae1077c7-d121-560e-b5a3-75101ff1e82a'::uuid, 1),
  ('00b4968c-efd6-5709-bee2-4e71e6c0c612'::uuid, 2),
  ('bc97ec22-10b7-5300-9c0e-f40d097a8dac'::uuid, 3),
  ('5645eeea-b8b0-5ef2-8b30-012352d0b903'::uuid, 4),
  ('827d7d94-7bef-5693-9002-88c4d272867d'::uuid, 5),
  -- Q24: correta na letra D
  ('c2f7be8e-38fc-5ce4-a6d7-64a0c2f40f42'::uuid, 1),
  ('06a9f4da-e00c-5f58-94e3-3f90624505ca'::uuid, 2),
  ('ec755c23-1a94-5ae4-bb87-50e7f4d92a51'::uuid, 3),
  ('efc84f36-21ad-5547-85ab-0aa45484198a'::uuid, 4),
  ('88a17bc4-b3f9-52eb-a768-cf8e6c5bd9fb'::uuid, 5),
  -- Q25: correta na letra B
  ('83a76634-0287-5ea3-85ed-472e5084e959'::uuid, 1),
  ('19bde2d5-3825-5e28-bad0-c06f70e9672c'::uuid, 2),
  ('d74d87c1-fc76-5602-92bb-2ae1bcceff2e'::uuid, 3),
  ('63406eea-d7a0-580e-9447-bb0523e0af77'::uuid, 4),
  ('4998c068-526f-56a3-8acf-c19d04ceb6fc'::uuid, 5),
  -- Q26: correta na letra A
  ('589beed2-b95e-53a6-8737-a3645f73882b'::uuid, 1),
  ('e056802a-1f93-5b82-855c-6eea1704a16b'::uuid, 2),
  ('01b6b1b0-5223-5956-a514-7b6ed1a1cfb7'::uuid, 3),
  ('1fa2f9f4-3cdb-5b51-89cb-222b2f27894a'::uuid, 4),
  ('6d6289cd-f585-54e7-8982-a020152da37b'::uuid, 5),
  -- Q27: correta na letra D
  ('4d935993-c0f3-53f1-879b-268a7b9bb81c'::uuid, 1),
  ('17a6c127-3f5f-509a-a9f0-a837c10d34ff'::uuid, 2),
  ('cfb64482-7b9a-5359-aceb-638f645dd799'::uuid, 3),
  ('233e1aa8-3b86-54e2-82ac-0612d41aed98'::uuid, 4),
  ('07b16733-3ac7-5f1b-9583-6f2d127827ae'::uuid, 5),
  -- Q28: correta na letra D
  ('3e873826-ec51-59dc-bcf6-770849967be5'::uuid, 1),
  ('3e269de9-5ad0-57b1-8e19-359815595c48'::uuid, 2),
  ('e2467ea9-86f5-5fb7-83a5-247d58b9285d'::uuid, 3),
  ('8ea6e426-1d2b-5695-9510-c76ca40c5913'::uuid, 4),
  ('511b493a-b465-52a7-b3b4-10511c702d7d'::uuid, 5),
  -- Q29: correta na letra A
  ('50e52a09-4c2b-5e2b-ba32-3a862c78906f'::uuid, 1),
  ('eaebc0d1-62d2-5e9c-9a9c-4808b3e48719'::uuid, 2),
  ('3207797d-a31f-5ae0-be1d-a15de7abe81f'::uuid, 3),
  ('ae79fd72-05d5-5c86-9b8f-cc8abfd51636'::uuid, 4),
  ('b216744b-b824-5b5f-bbb9-72c4176b89b0'::uuid, 5),
  -- Q30: correta na letra D
  ('34c14ec9-e04b-50fa-8df2-d17959cacf6a'::uuid, 1),
  ('0023d3c9-f4dc-59aa-916e-31340ed3152e'::uuid, 2),
  ('61065529-b29c-52d2-8bea-9a043c0c95b4'::uuid, 3),
  ('618277da-cc04-5bf4-bb9a-ab581d8dd097'::uuid, 4),
  ('98ed7ca5-c25f-5cb3-8c03-5166dedacd79'::uuid, 5),
  -- Q31: correta na letra A
  ('7cc16976-d7e4-598a-b06d-07e2cb58a106'::uuid, 1),
  ('0c5bbf4b-c577-5441-b4da-d9c6492db15b'::uuid, 2),
  ('393d7aed-2259-575e-b007-4720dafb77f8'::uuid, 3),
  ('2267731b-6728-5411-b52b-3942f2e81b49'::uuid, 4),
  ('cb762d0c-2189-5d5d-803c-b21c1dee1fbf'::uuid, 5),
  -- Q32: correta na letra D
  ('ac2e058e-f74c-5152-ae44-6add95e0473e'::uuid, 1),
  ('63440f4b-8c76-5857-ab03-8fcf1c3496a5'::uuid, 2),
  ('5251dfe8-9b1f-57a6-b425-0add91d8b629'::uuid, 3),
  ('95a985ec-76e8-56a1-88f1-04cc7f61a156'::uuid, 4),
  ('3dadd404-77ab-577f-98e9-0227b75f965f'::uuid, 5)
  ) as n (id, ordem)
 where n.id = a.id;

-- Passo 3: conferência. Se alguma alternativa ficou sem posição final, a
-- exceção cancela a migration inteira (nada é alterado).
do $$
begin
  if exists (select 1 from public.alternativas where ordem > 5) then
    raise exception 'Há alternativas sem posição final; nada foi alterado.';
  end if;
end;
$$;
