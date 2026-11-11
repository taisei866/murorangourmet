-- Supabase の SQL Editor に貼り付けて実行してください

create table shops (
  id bigint generated always as identity primary key,
  name text not null, genre text not null, area text, address text,
  lat double precision not null, lng double precision not null,
  budget int, hours text, note text,
  solo boolean default false, late boolean default false,
  parking boolean default false, takeout boolean default false
);

create table reviews (
  id bigint generated always as identity primary key,
  shop_id bigint not null references shops on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  username text, rating int not null check (rating between 1 and 5), body text,
  created_at timestamptz default now()
);

create table favorites (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  shop_id bigint not null references shops on delete cascade,
  primary key (user_id, shop_id)
);

create table visits (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  shop_id bigint not null references shops on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, shop_id)
);

-- 行単位のアクセス制御
alter table shops enable row level security;
alter table reviews enable row level security;
alter table favorites enable row level security;
alter table visits enable row level security;

create policy "店舗は誰でも閲覧" on shops for select using (true);
create policy "口コミは誰でも閲覧" on reviews for select using (true);
create policy "口コミ投稿は本人" on reviews for insert with check (auth.uid() = user_id);
create policy "口コミ削除は本人" on reviews for delete using (auth.uid() = user_id);
create policy "お気に入りは本人のみ" on favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "訪問記録は本人のみ" on visits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 店舗データ（2026年11月時点のWeb情報。営業時間等は要確認）
insert into shops (name, genre, area, address, lat, lng, budget, hours, solo, late, parking, takeout, note) values
('味の大王 室蘭本店','ラーメン','室蘭駅','室蘭市中央町2-9-3',42.317649,140.970308,1000,'11:00-15:00（火曜休）',true,false,true,false,'室蘭カレーラーメン発祥といわれる老舗'),
('清洋軒','ラーメン','室蘭駅','室蘭市舟見町1-6-4',42.310975,140.971253,1000,'11:00-17:00（火曜休）',true,false,false,false,'塩ラーメンが看板の人気店'),
('鳥辰 本店','やきとり・居酒屋','室蘭駅','室蘭市中央町3-7-1',42.316757,140.972311,3000,'17:00-23:30（月曜休）',false,true,false,true,'室蘭やきとりの有名店'),
('鳥よし','やきとり・居酒屋','輪西','室蘭市輪西町2-2-8',42.335578,141.011876,2500,'17:00-20:30',true,false,false,false,'昭和レトロな老舗。現金のみ'),
('やきとりの一平 中島本店','やきとり・居酒屋','中島','室蘭市中島町1-17-3',42.352904,141.016157,3000,'17:00-23:00',true,true,false,true,'1950年創業。予約がおすすめ'),
('ラーメン・ギョーザ 十八番 中島店','ラーメン','中島','室蘭市中島町1-23-7',42.354659,141.018375,1100,'11:00-21:00',true,false,false,false,'手作りの大きな餃子が名物'),
('岩本珈琲店','カフェ・スイーツ・洋食','中島','室蘭市中島町1-23-15',42.354218,141.018119,1000,'要確認',true,false,false,false,'サイフォンで淹れるコーヒーとカレー'),
('室感食堂','カレー・定食屋／ワンコイン・激安大盛り','中島','室蘭市中島町1-4-1',42.349862,141.011225,700,'9:00-21:00（火曜休）',true,false,true,false,'水産加工会社直営の食堂。タブレット注文'),
('麺屋智','ラーメン／カレー・定食屋','東室蘭','室蘭市中島町3-25-9',42.349726,141.02447,1100,'11:00-15:00, 17:00-20:30（月曜休）',true,false,false,false,'カレーらーめんと数量限定スープカレー'),
('やきとり一平 工大前店','やきとり・居酒屋','水元','室蘭市高砂町5-6',42.37651,141.034579,2500,'17:00-22:00（水曜休）',true,false,false,false,'室蘭工大の近く');
