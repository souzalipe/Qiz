-- =============================================================================
-- V2 (Bloco A) — Textos revisados das 32 perguntas
--
-- Reescreve enunciado, feedback e as alternativas A–D no lugar (mesmos IDs):
--   * alternativas com tamanhos equilibrados (a correta deixa de ser a mais
--     longa, o que entregava a resposta);
--   * siglas explicadas no texto (EC, CONAMA, PNRS, ODS, ONU, APL…).
--
-- NÃO altera: alternativas.correta, alternativas.ordem (letras balanceadas),
-- "Não sei." nem partidas/respostas — as respostas já coletadas continuam
-- apontando para as mesmas alternativas, agora com o texto revisado.
--
-- Origem: update_banco_v2.sql da pesquisa, com uma correção na Q16 (os textos
-- da correta e de uma errada estavam trocados de ID).
-- =============================================================================

-- Q1
UPDATE public.perguntas SET enunciado = 'Qual é a principal diferença entre a economia linear e a economia circular?', feedback = 'A economia circular se opõe ao modelo linear ao propor que os materiais circulem pelo maior tempo possível, em vez de virarem lixo.' WHERE id = 'b7ecacab-4f40-55d8-bed9-e0daec05a1b7';
UPDATE public.alternativas SET texto = 'A circular funciona só com energia solar' WHERE id = 'e3a61544-6476-544b-b563-cce041469558';
UPDATE public.alternativas SET texto = 'A linear reaproveita tudo; a circular descarta' WHERE id = 'cf05dedb-c685-5871-ae16-f159cbb96704';
UPDATE public.alternativas SET texto = 'A linear descarta; a circular mantém em uso' WHERE id = '5a641e46-226c-5d42-8b49-3e8201c26576';
UPDATE public.alternativas SET texto = 'São modelos iguais, só com outros nomes' WHERE id = '104d2e47-199d-5678-9553-52b6865ce6d5';

-- Q2
UPDATE public.perguntas SET enunciado = 'Qual conjunto abaixo representa práticas da economia circular?', feedback = 'Os “R’s” (reduzir, reutilizar, reciclar — e também repensar, reparar, recuperar) são as estratégias centrais para fechar o ciclo dos materiais.' WHERE id = 'df649eb9-afa6-5c9f-90d4-3682c3b6e62b';
UPDATE public.alternativas SET texto = 'Extrair, produzir e descartar' WHERE id = '16866555-34cf-5448-87cd-dc6101305372';
UPDATE public.alternativas SET texto = 'Reduzir, reutilizar e reciclar' WHERE id = 'fdd455a2-7e3d-540a-ad08-fff5c4f508ba';
UPDATE public.alternativas SET texto = 'Comprar, usar e jogar fora' WHERE id = 'b98d2f55-176c-5beb-b92a-f64e5e55bdc3';
UPDATE public.alternativas SET texto = 'Importar, consumir e acumular' WHERE id = 'abbfecf5-fe0f-5089-948f-c3356b012847';

-- Q3
UPDATE public.perguntas SET enunciado = 'Uma pessoa conserta o sapato em vez de comprar outro. Que princípio ela aplica?', feedback = 'Reparar prolonga a vida útil dos produtos, reduzindo a necessidade de fabricar novos — um princípio-chave da circularidade.' WHERE id = '4720d30a-cdf2-5eda-81e5-84698207bf15';
UPDATE public.alternativas SET texto = 'Descarte imediato do produto' WHERE id = '47fe2cfc-ce3c-5a65-acd5-d097f1fc8f89';
UPDATE public.alternativas SET texto = 'Reparo, que prolonga a vida útil' WHERE id = 'e613ef64-ed0d-5099-b911-305db5234476';
UPDATE public.alternativas SET texto = 'Extração de novos recursos' WHERE id = 'cdaf128e-a40b-5d6f-ba00-a79cfa94d2e6';
UPDATE public.alternativas SET texto = 'Obsolescência programada do item' WHERE id = 'adc6e71e-0553-508d-84da-90fd8e93941b';

-- Q4
UPDATE public.perguntas SET enunciado = 'Na economia circular, os resíduos orgânicos (restos de comida) idealmente devem:', feedback = 'A EC (economia circular) separa os ciclos biológicos (materiais que voltam à natureza, como na compostagem) dos ciclos técnicos (reaproveitados na indústria).' WHERE id = 'f48f3170-e00b-57dc-894a-9e249f3ea537';
UPDATE public.alternativas SET texto = 'Seguir direto para o aterro sanitário' WHERE id = '1dc2f488-615c-5fe9-8b02-d5f7f80f8170';
UPDATE public.alternativas SET texto = 'Ser queimados em incineradores' WHERE id = 'f75c3880-0b6c-51a2-8e13-02ce20257edf';
UPDATE public.alternativas SET texto = 'Voltar ao solo pela compostagem' WHERE id = 'd871f72f-e46d-51a4-ba60-6740d90971b8';
UPDATE public.alternativas SET texto = 'Ser misturados ao plástico comum' WHERE id = '793d1264-cadc-5f5f-b298-90af9a28cd1f';

-- Q5
UPDATE public.perguntas SET enunciado = 'Na coleta seletiva (padrão do CONAMA), qual cor identifica o plástico?', feedback = 'CONAMA é o Conselho Nacional do Meio Ambiente. No padrão: vermelho = plástico, azul = papel, verde = vidro, amarelo = metal.' WHERE id = '510b72a9-deda-5ef3-86d9-26c5421ccd26';
UPDATE public.alternativas SET texto = 'Azul' WHERE id = '0b38c47a-6276-5aee-84ad-f9537acd3bec';
UPDATE public.alternativas SET texto = 'Verde' WHERE id = '4790adf2-5d3c-5188-bd85-2d61a95a192e';
UPDATE public.alternativas SET texto = 'Vermelho' WHERE id = 'fcb0c9ea-c03d-5892-a19a-85a71c2eb602';
UPDATE public.alternativas SET texto = 'Amarelo' WHERE id = '6fe065ea-526b-53ec-86d9-7178b3a65d54';

-- Q6
UPDATE public.perguntas SET enunciado = 'Qual destes materiais NÃO é reciclável na coleta comum?', feedback = 'Papel higiênico usado, guardanapos engordurados e espelhos não vão para a reciclagem comum — contaminam ou não são recicláveis.' WHERE id = '99aac92b-3a0d-5538-846e-3b6630118396';
UPDATE public.alternativas SET texto = 'Garrafa PET (plástico)' WHERE id = '0ed76d1d-a4a9-5bda-948c-08d69a769343';
UPDATE public.alternativas SET texto = 'Lata de alumínio' WHERE id = '162ebc70-a1cb-5120-9134-edbc9900301c';
UPDATE public.alternativas SET texto = 'Papel higiênico usado' WHERE id = '4e863c7d-287a-5039-9241-35eea50b79bb';
UPDATE public.alternativas SET texto = 'Caixa de papelão' WHERE id = 'a78903b4-b051-59f6-81e2-29d72e0785c4';

-- Q7
UPDATE public.perguntas SET enunciado = 'O que é compostagem?', feedback = 'A compostagem decompõe restos orgânicos (cascas, folhas) em adubo, devolvendo nutrientes ao solo.' WHERE id = 'e97434ad-2179-5ccc-ba8a-f0a22a402db4';
UPDATE public.alternativas SET texto = 'Queimar o lixo para gerar energia' WHERE id = '6f4a0522-1f2d-5bbd-a65e-1d52eb37119f';
UPDATE public.alternativas SET texto = 'Transformar resíduos orgânicos em adubo' WHERE id = '605c82ed-c718-56be-b8c3-6331dad8f41d';
UPDATE public.alternativas SET texto = 'Prensar latas para reciclagem' WHERE id = '2c928981-05d4-5001-9914-635024011c38';
UPDATE public.alternativas SET texto = 'Enterrar o lixo em aterros' WHERE id = '9b5acbca-1564-58a6-a786-2dd69633ef1b';

-- Q8
UPDATE public.perguntas SET enunciado = 'Qual a diferença entre “resíduo” e “rejeito” na gestão de resíduos?', feedback = 'Resíduo ainda pode ser reciclado ou reutilizado; rejeito é o que sobra sem alternativa, indo para o aterro.' WHERE id = '43b4bccc-b54b-5444-8533-f9fc579cb84f';
UPDATE public.alternativas SET texto = 'São exatamente a mesma coisa' WHERE id = 'ad02fca4-279d-5e84-bf9a-ffc1b3bca902';
UPDATE public.alternativas SET texto = 'Resíduo se reaproveita; rejeito, não' WHERE id = 'e52a78aa-7730-565e-8a6a-87bae21703fd';
UPDATE public.alternativas SET texto = 'Rejeito recicla; resíduo, não' WHERE id = '270103c2-b523-588e-826c-50338f416390';
UPDATE public.alternativas SET texto = 'Resíduo é líquido; rejeito, sólido' WHERE id = '998f751e-a91a-5221-b97c-93477fba5675';

-- Q9
UPDATE public.perguntas SET enunciado = 'O que é a PNRS (Política Nacional de Resíduos Sólidos)?', feedback = 'A PNRS (Lei 12.305/2010) é o marco legal que define regras e responsabilidades para a gestão de resíduos no Brasil.' WHERE id = '9fc4adee-cd2a-55db-92bb-d108bd5d427c';
UPDATE public.alternativas SET texto = 'Uma empresa pública de reciclagem' WHERE id = '3ddce842-4ea8-5252-a541-83eefa20ade6';
UPDATE public.alternativas SET texto = 'A lei que organiza os resíduos no Brasil' WHERE id = 'db70828e-6d7d-517b-a402-139c4a3c893d';
UPDATE public.alternativas SET texto = 'Um imposto cobrado sobre o lixo' WHERE id = '499c0675-da35-5c8c-921a-a23818fd4df7';
UPDATE public.alternativas SET texto = 'Uma ONG de defesa ambiental' WHERE id = '76db75e0-b6bb-591a-a0b6-6e69ab8d4991';

-- Q10
UPDATE public.perguntas SET enunciado = 'O princípio da “responsabilidade compartilhada” da PNRS diz que:', feedback = 'A responsabilidade compartilhada envolve fabricantes, comerciantes, poder público e consumidores no ciclo de vida do produto.' WHERE id = '115cfa30-635f-59eb-bd71-66cfe5b6154c';
UPDATE public.alternativas SET texto = 'Só o governo responde pelo lixo' WHERE id = '26a7f662-cac9-5077-a44c-a35c95cd29a0';
UPDATE public.alternativas SET texto = 'Só o consumidor responde pelo lixo' WHERE id = 'c3b0c218-943f-57b5-898e-1a5d1ae67cf9';
UPDATE public.alternativas SET texto = 'Governo, empresas e cidadãos dividem o dever' WHERE id = '8bccc91c-0652-54a6-82b8-b3c8565c1537';
UPDATE public.alternativas SET texto = 'Ninguém precisa se responsabilizar' WHERE id = 'a780abdc-f0dc-5009-94b3-1a9e8427b41e';

-- Q11
UPDATE public.perguntas SET enunciado = 'O que é “logística reversa”?', feedback = 'A logística reversa faz produtos como pilhas, eletrônicos e embalagens voltarem para reciclagem ou descarte adequado.' WHERE id = 'b0e3b12a-350f-580a-a22d-b8592b6d456e';
UPDATE public.alternativas SET texto = 'Entregar produtos com mais rapidez' WHERE id = '3500223d-dd6d-5f63-9499-9a1661005882';
UPDATE public.alternativas SET texto = 'Devolver usados ao fabricante para destino correto' WHERE id = 'c5778980-7bd0-5338-a76f-3975f42a3fcc';
UPDATE public.alternativas SET texto = 'Reembolsar o dinheiro ao cliente' WHERE id = 'a4d328a6-a071-5ef7-be19-f85eb6942ee1';
UPDATE public.alternativas SET texto = 'Levar o lixo para outro país' WHERE id = '5cc6e7d8-cb23-54d0-a44d-277cf5e86e01';

-- Q12
UPDATE public.perguntas SET enunciado = 'A PNRS define uma ordem de prioridade no manejo de resíduos. Qual é?', feedback = 'A PNRS prioriza, nesta ordem: não geração, redução, reutilização, reciclagem, tratamento e disposição final ambientalmente adequada.' WHERE id = '7d389371-9196-5b16-b5f9-dccc1055e27c';
UPDATE public.alternativas SET texto = 'Descartar, reciclar e depois reduzir' WHERE id = '38ea9f6c-8458-528f-ae7d-7f492f5a576e';
UPDATE public.alternativas SET texto = 'Não gerar → reduzir → reutilizar → reciclar → tratar → dispor' WHERE id = 'b585c2d7-c74a-5beb-8804-df397e322965';
UPDATE public.alternativas SET texto = 'Reciclar primeiro e reduzir por último' WHERE id = '6c268fa5-5490-5465-94fd-9e88dd04d825';
UPDATE public.alternativas SET texto = 'Queimar todo o material gerado' WHERE id = '1857f371-81a4-52ac-ac1d-e89fc41fa028';

-- Q13
UPDATE public.perguntas SET enunciado = 'Qual o papel dos catadores de recicláveis na economia circular?', feedback = 'Os catadores são protagonistas da reciclagem no Brasil, retornando materiais ao ciclo produtivo e prestando um serviço ambiental e social.' WHERE id = 'd833f656-6609-5673-bb31-b9c3a734ef16';
UPDATE public.alternativas SET texto = 'Nenhum, é atividade ultrapassada' WHERE id = 'e802f0db-8d33-5daa-a64c-e0169e75982f';
UPDATE public.alternativas SET texto = 'Coletam e triam boa parte do que se recicla' WHERE id = '30206a4c-8350-5404-b1b8-a927f9476811';
UPDATE public.alternativas SET texto = 'Só levam o lixo ao aterro' WHERE id = '7f7c4916-057e-5554-9837-7de06219dbdf';
UPDATE public.alternativas SET texto = 'Lidam apenas com resíduos orgânicos' WHERE id = 'a3ac8a3f-6591-573c-8b4a-920cb49c8c94';

-- Q14
UPDATE public.perguntas SET enunciado = 'O que é uma cooperativa de catadores?', feedback = 'Nas cooperativas, os catadores ganham escala, conseguem melhores preços pelo material e têm mais dignidade e segurança no trabalho.' WHERE id = '4195884c-681d-59b9-9562-9244a1720ffc';
UPDATE public.alternativas SET texto = 'Uma empresa privada de coleta' WHERE id = 'cf9d67a2-be5c-59ea-b185-012d3762e5dc';
UPDATE public.alternativas SET texto = 'Grupo de catadores que atua coletivamente' WHERE id = 'b00beb42-e213-50df-88d1-e5adee1d7aa4';
UPDATE public.alternativas SET texto = 'Um órgão público do governo' WHERE id = '11586f4f-c4b5-5263-81f0-dc15a673cc93';
UPDATE public.alternativas SET texto = 'Um tipo de aterro sanitário' WHERE id = '2afd2e91-fe45-5d7c-ba48-610068e5ba53';

-- Q15
UPDATE public.perguntas SET enunciado = 'A inclusão dos catadores liga a economia circular a qual dimensão?', feedback = 'A EC não é só ambiental — incluir catadores gera renda e cidadania, unindo sustentabilidade ambiental, econômica e social.' WHERE id = 'be0edf01-cc91-53ac-901d-65f140db0564';
UPDATE public.alternativas SET texto = 'Apenas à dimensão tecnológica' WHERE id = '1a9409f1-1657-5a28-bf82-876f0ebb77a5';
UPDATE public.alternativas SET texto = 'À dimensão social (renda e inclusão)' WHERE id = '5472ec73-4736-5ad2-befe-cdd2cdb1cf57';
UPDATE public.alternativas SET texto = 'Apenas à dimensão estética' WHERE id = 'afb52624-bba6-5fb0-a5fb-b138b21d5f17';
UPDATE public.alternativas SET texto = 'A nenhuma outra dimensão' WHERE id = '02bda1ff-d0e5-5671-8114-21001a58cb1e';

-- Q16
UPDATE public.perguntas SET enunciado = 'Como a PNRS trata os catadores?', feedback = 'A PNRS prioriza a participação de cooperativas de catadores, reconhecendo seu papel social e ambiental na gestão de resíduos.' WHERE id = '0f35251e-cbe2-5f87-85c1-052015220357';
UPDATE public.alternativas SET texto = 'Proíbe totalmente a atividade' WHERE id = 'b2dbd1b8-9716-5d80-9ef5-6e788e3772f0';
UPDATE public.alternativas SET texto = 'Incentiva cooperativas na coleta seletiva' WHERE id = '346f019a-76e1-545b-b596-f3c989fd617a';  -- correta (corrigido: no arquivo original os textos de 346f019a e 28b7e7c7 estavam trocados)
UPDATE public.alternativas SET texto = 'Ignora a categoria por completo' WHERE id = '28b7e7c7-9b2b-5b96-8607-4e0c1ab59003';
UPDATE public.alternativas SET texto = 'Permite só empresas reciclarem' WHERE id = '898c5722-d4de-5640-83cd-bae6fe9ae1cd';

-- Q17
UPDATE public.perguntas SET enunciado = 'O que é “obsolescência programada”?', feedback = 'A obsolescência programada encurta de propósito a vida dos produtos, gerando mais consumo e mais lixo — o oposto da EC.' WHERE id = 'c1cc679e-8487-58c1-9c8f-5d57aa1f6658';
UPDATE public.alternativas SET texto = 'Produto feito para durar para sempre' WHERE id = 'f55b306e-e5ce-5423-863d-8fcc13e6b2ad';
UPDATE public.alternativas SET texto = 'Produto feito para durar pouco' WHERE id = '810e0421-328a-52d5-bfcf-1b1d30985185';
UPDATE public.alternativas SET texto = 'Uma técnica de reciclagem' WHERE id = '9ec3b50e-dd62-56ba-b45a-93bce1afb545';
UPDATE public.alternativas SET texto = 'Um tipo de imposto novo' WHERE id = '73aaaebc-3437-5917-a288-749a8a3b198e';

-- Q18
UPDATE public.perguntas SET enunciado = 'O que mede a “pegada ecológica”?', feedback = 'A pegada ecológica estima quanto da natureza usamos para sustentar nosso estilo de vida — quanto menor, mais sustentável.' WHERE id = '366f8ced-d2e4-52bc-9607-ccfe39931e6a';
UPDATE public.alternativas SET texto = 'O tamanho do pé da pessoa' WHERE id = '8811f453-ef02-55ce-9f03-3f5c1d3763a7';
UPDATE public.alternativas SET texto = 'O impacto do consumo sobre o planeta' WHERE id = '46324260-6d6e-5758-9184-896ef0a446a8';
UPDATE public.alternativas SET texto = 'O total de dinheiro gasto' WHERE id = '69d5d2d4-bc0c-5eee-8807-e03393b4d142';
UPDATE public.alternativas SET texto = 'O número de viagens feitas' WHERE id = '340b6ad4-ee48-504c-b926-60c8d8342ca6';

-- Q19
UPDATE public.perguntas SET enunciado = 'Qual atitude representa consumo consciente?', feedback = 'Consumo consciente é escolher com critério — priorizar durabilidade, necessidade real e menor impacto ambiental.' WHERE id = '7e5d664c-5fa2-5feb-b42e-9fc197d77b60';
UPDATE public.alternativas SET texto = 'Trocar de celular todo ano' WHERE id = 'd20352ab-6204-51ac-8397-51ff4ea9cebc';
UPDATE public.alternativas SET texto = 'Comprar durável e evitar desperdício' WHERE id = 'a9060618-a54e-5f92-b14b-c77a4e8e7d8b';
UPDATE public.alternativas SET texto = 'Comprar tudo por impulso' WHERE id = 'd5468657-9289-5534-bd95-fd1a43761231';
UPDATE public.alternativas SET texto = 'Descartar o que ainda funciona' WHERE id = '78454ba6-143d-5108-8a9d-6c83686639a6';

-- Q20
UPDATE public.perguntas SET enunciado = 'Serviços de compartilhamento (aluguel, bibliotecas) ajudam a economia circular porque:', feedback = 'Compartilhar intensifica o uso de cada produto, reduzindo o desperdício e a extração de novos recursos.' WHERE id = '95e95236-b512-5577-82da-7f1210b3148d';
UPDATE public.alternativas SET texto = 'Aumentam a produção de itens novos' WHERE id = '8646c976-5fc7-5c61-be34-41b4b6971509';
UPDATE public.alternativas SET texto = 'Um produto serve a muitas pessoas' WHERE id = '30ca4f99-e04d-5959-8acc-3052a558e1a8';
UPDATE public.alternativas SET texto = 'Estimulam o descarte rápido' WHERE id = '11c09da3-35e0-5096-98b7-e95fa2bdd7d3';
UPDATE public.alternativas SET texto = 'Não têm ligação com a circularidade' WHERE id = 'ef76ce58-72c4-588b-8802-242c96733688';

-- Q21
UPDATE public.perguntas SET enunciado = 'No modelo “produto como serviço”, o cliente:', feedback = 'Em vez de vender o produto, a empresa vende o serviço (ex.: aluguel), tendo interesse em que ele dure e seja reaproveitado.' WHERE id = '881f5988-0a8d-5d27-9306-74884648036c';
UPDATE public.alternativas SET texto = 'Compra e fica dono para sempre' WHERE id = '01ad08a2-4e54-53e3-876f-9b91074baa6d';
UPDATE public.alternativas SET texto = 'Paga pelo uso; a empresa mantém o produto' WHERE id = '02433fd3-ee26-5b30-9e2d-ef923e0eb1d1';
UPDATE public.alternativas SET texto = 'Recebe o produto de graça' WHERE id = '595e70f0-9517-52c2-812d-a13131da44aa';
UPDATE public.alternativas SET texto = 'Descarta o produto por conta própria' WHERE id = 'b67137c8-a8cf-524a-927d-b8dff8d65a48';

-- Q22
UPDATE public.perguntas SET enunciado = 'O que é remanufatura?', feedback = 'A remanufatura restaura produtos usados (motores, eletrônicos) a um estado equivalente ao novo, poupando materiais e energia.' WHERE id = '0548d1f0-6bcf-5e83-a174-b828bd4f7521';
UPDATE public.alternativas SET texto = 'Descartar e fabricar do zero' WHERE id = 'f934c24c-9ad1-5342-bb65-5bb2f7765301';
UPDATE public.alternativas SET texto = 'Restaurar usados à condição de novos' WHERE id = '8e408cbc-cf68-50dd-908c-1a1f916c94bb';
UPDATE public.alternativas SET texto = 'Reciclar somente o plástico' WHERE id = '8c8ec4b5-65f7-5684-b005-93cd791394e2';
UPDATE public.alternativas SET texto = 'Importar peças já prontas' WHERE id = '6114e8ae-5281-5bee-a2db-84702a2fffb4';

-- Q23
UPDATE public.perguntas SET enunciado = 'O que é “ecodesign”?', feedback = 'O ecodesign considera todo o ciclo de vida do produto já na fase de projeto, facilitando reparo, reúso e reciclagem.' WHERE id = 'c34b3954-67f4-593f-a4f4-b880c70bbecf';
UPDATE public.alternativas SET texto = 'Projetar produtos apenas bonitos' WHERE id = 'bc97ec22-10b7-5300-9c0e-f40d097a8dac';
UPDATE public.alternativas SET texto = 'Projetar pensando em reparo e reciclagem' WHERE id = '00b4968c-efd6-5709-bee2-4e71e6c0c612';
UPDATE public.alternativas SET texto = 'Usar somente a cor verde' WHERE id = 'ae1077c7-d121-560e-b5a3-75101ff1e82a';
UPDATE public.alternativas SET texto = 'Desenhar produtos no computador' WHERE id = '5645eeea-b8b0-5ef2-8b30-012352d0b903';

-- Q24
UPDATE public.perguntas SET enunciado = 'O que é “simbiose industrial”?', feedback = 'Na simbiose industrial, o que sobra de um processo alimenta outro, fechando ciclos entre empresas — como em um ecossistema.' WHERE id = 'f8b1351e-7783-5d68-8d03-27a8a43f9c75';
UPDATE public.alternativas SET texto = 'Duas empresas concorrentes em disputa' WHERE id = '06a9f4da-e00c-5f58-94e3-3f90624505ca';
UPDATE public.alternativas SET texto = 'O resíduo de uma vira insumo de outra' WHERE id = 'efc84f36-21ad-5547-85ab-0aa45484198a';
UPDATE public.alternativas SET texto = 'A fusão entre duas empresas' WHERE id = 'c2f7be8e-38fc-5ce4-a6d7-64a0c2f40f42';
UPDATE public.alternativas SET texto = 'Um tipo de poluição industrial' WHERE id = 'ec755c23-1a94-5ae4-bb87-50e7f4d92a51';

-- Q25
UPDATE public.perguntas SET enunciado = 'Como a economia circular contribui para o desenvolvimento local?', feedback = 'A EC pode fortalecer a economia local ao criar empregos verdes, valorizar recursos da região e reduzir a dependência externa.' WHERE id = '842a3daf-1c7f-53d0-bf6b-ff236b986695';
UPDATE public.alternativas SET texto = 'Mandando resíduos para outras cidades' WHERE id = 'd74d87c1-fc76-5602-92bb-2ae1bcceff2e';
UPDATE public.alternativas SET texto = 'Gerando renda e empregos no território' WHERE id = '19bde2d5-3825-5e28-bad0-c06f70e9672c';
UPDATE public.alternativas SET texto = 'Fechando os negócios da região' WHERE id = '83a76634-0287-5ea3-85ed-472e5084e959';
UPDATE public.alternativas SET texto = 'Não tem relação com o local' WHERE id = '63406eea-d7a0-580e-9447-bb0523e0af77';

-- Q26
UPDATE public.perguntas SET enunciado = 'Qual o papel do município na economia circular?', feedback = 'O município é peça-chave: é ele que estrutura a gestão de resíduos e pode incluir cooperativas e iniciativas locais.' WHERE id = '2f97b871-ddd1-542e-b190-66ce97c460ac';
UPDATE public.alternativas SET texto = 'Nenhum, a função é só federal' WHERE id = '1fa2f9f4-3cdb-5b51-89cb-222b2f27894a';
UPDATE public.alternativas SET texto = 'Organizar a coleta e apoiar catadores' WHERE id = '589beed2-b95e-53a6-8737-a3645f73882b';
UPDATE public.alternativas SET texto = 'Apenas arrecadar impostos locais' WHERE id = '01b6b1b0-5223-5956-a514-7b6ed1a1cfb7';
UPDATE public.alternativas SET texto = 'Proibir a reciclagem na cidade' WHERE id = 'e056802a-1f93-5b82-855c-6eea1704a16b';

-- Q27
UPDATE public.perguntas SET enunciado = 'O que é um APL (Arranjo Produtivo Local)?', feedback = 'APLs reúnem produtores, cooperativas e instituições de um território — um caminho para a EC gerar desenvolvimento local.' WHERE id = 'e38b6729-15bf-5226-a5cb-c222fe6fe72e';
UPDATE public.alternativas SET texto = 'Uma grande loja de departamentos' WHERE id = '4d935993-c0f3-53f1-879b-268a7b9bb81c';
UPDATE public.alternativas SET texto = 'Empresas de uma região que cooperam' WHERE id = '233e1aa8-3b86-54e2-82ac-0612d41aed98';
UPDATE public.alternativas SET texto = 'Um novo modelo de aterro' WHERE id = 'cfb64482-7b9a-5359-aceb-638f645dd799';
UPDATE public.alternativas SET texto = 'Uma lei de proteção ambiental' WHERE id = '17a6c127-3f5f-509a-a9f0-a837c10d34ff';

-- Q28
UPDATE public.perguntas SET enunciado = 'Uma horta comunitária que usa a compostagem do bairro é exemplo de:', feedback = 'A horta fecha o ciclo (resíduo orgânico vira adubo, que vira alimento) e fortalece a comunidade — EC e desenvolvimento local juntos.' WHERE id = 'b6f39ba4-0c05-51c4-8294-1d47a40ff4d2';
UPDATE public.alternativas SET texto = 'Economia linear tradicional' WHERE id = '3e269de9-5ad0-57b1-8e19-359815595c48';
UPDATE public.alternativas SET texto = 'Economia circular no território' WHERE id = '8ea6e426-1d2b-5695-9510-c76ca40c5913';
UPDATE public.alternativas SET texto = 'Desperdício de recursos locais' WHERE id = '3e873826-ec51-59dc-bcf6-770849967be5';
UPDATE public.alternativas SET texto = 'Obsolescência programada do bairro' WHERE id = 'e2467ea9-86f5-5fb7-83a5-247d58b9285d';

-- Q29
UPDATE public.perguntas SET enunciado = 'O “tripé da sustentabilidade” reúne quais três dimensões?', feedback = 'A sustentabilidade equilibra o ambiental, o social e o econômico — os três precisam andar juntos.' WHERE id = 'ab22fa53-abe1-523f-897e-5216871dc689';
UPDATE public.alternativas SET texto = 'Passado, presente e futuro' WHERE id = 'eaebc0d1-62d2-5e9c-9a9c-4808b3e48719';
UPDATE public.alternativas SET texto = 'Ambiental, social e econômica' WHERE id = '50e52a09-4c2b-5e2b-ba32-3a862c78906f';
UPDATE public.alternativas SET texto = 'Água, terra e ar' WHERE id = '3207797d-a31f-5ae0-be1d-a15de7abe81f';
UPDATE public.alternativas SET texto = 'Governo, empresa e igreja' WHERE id = 'ae79fd72-05d5-5c86-9b8f-cc8abfd51636';

-- Q30
UPDATE public.perguntas SET enunciado = 'O ODS 12 (Objetivos de Desenvolvimento Sustentável) trata de:', feedback = 'O ODS 12 (Consumo e Produção Responsáveis) é o objetivo que mais dialoga com a economia circular.' WHERE id = '9c7c1ee1-278e-5db3-b178-660c9e8bf3d0';
UPDATE public.alternativas SET texto = 'Educação de qualidade para todos' WHERE id = '61065529-b29c-52d2-8bea-9a043c0c95b4';
UPDATE public.alternativas SET texto = 'Consumo e produção responsáveis' WHERE id = '618277da-cc04-5bf4-bb9a-ab581d8dd097';
UPDATE public.alternativas SET texto = 'Energia limpa e acessível' WHERE id = '34c14ec9-e04b-50fa-8df2-d17959cacf6a';
UPDATE public.alternativas SET texto = 'Vida aquática nos oceanos' WHERE id = '0023d3c9-f4dc-59aa-916e-31340ed3152e';

-- Q31
UPDATE public.perguntas SET enunciado = 'O que são os ODS (Objetivos de Desenvolvimento Sustentável)?', feedback = 'Os 17 ODS, da Agenda 2030 da ONU (Organização das Nações Unidas), orientam países e organizações rumo à sustentabilidade.' WHERE id = 'de3315a3-4cc6-5438-9561-13d0bf20f8a3';
UPDATE public.alternativas SET texto = 'Uma marca de produtos verdes' WHERE id = '2267731b-6728-5411-b52b-3942f2e81b49';
UPDATE public.alternativas SET texto = '17 metas globais da ONU até 2030' WHERE id = '7cc16976-d7e4-598a-b06d-07e2cb58a106';
UPDATE public.alternativas SET texto = 'Uma lei ambiental brasileira' WHERE id = '393d7aed-2259-575e-b007-4720dafb77f8';
UPDATE public.alternativas SET texto = 'Um imposto ambiental da ONU' WHERE id = '0c5bbf4b-c577-5441-b4da-d9c6492db15b';

-- Q32
UPDATE public.perguntas SET enunciado = 'Por que a economia circular é considerada uma estratégia de sustentabilidade?', feedback = 'Ao manter materiais em uso e reduzir a extração e o lixo, a EC ataca diretamente as causas da degradação ambiental.' WHERE id = 'a429f320-6d24-5784-92d5-68bcabf556be';
UPDATE public.alternativas SET texto = 'Porque aumenta o consumo geral' WHERE id = 'ac2e058e-f74c-5152-ae44-6add95e0473e';
UPDATE public.alternativas SET texto = 'Porque reduz desperdício e uso de recursos' WHERE id = '95a985ec-76e8-56a1-88f1-04cc7f61a156';
UPDATE public.alternativas SET texto = 'Porque só barateia para as empresas' WHERE id = '5251dfe8-9b1f-57a6-b425-0add91d8b629';
UPDATE public.alternativas SET texto = 'Porque elimina a reciclagem' WHERE id = '63440f4b-8c76-5857-ab03-8fcf1c3496a5';
