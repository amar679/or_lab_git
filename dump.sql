PGDMP  $    -            	    |            kafici    16.2    16.2     .           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            /           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            0           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            1           1262    17038    kafici    DATABASE     r   CREATE DATABASE kafici WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'hr_HR.UTF-8';
    DROP DATABASE kafici;
                postgres    false            �            1259    17239    ima_pon    TABLE     V   CREATE TABLE public.ima_pon (
    id integer NOT NULL,
    id_pon integer NOT NULL
);
    DROP TABLE public.ima_pon;
       public         heap    postgres    false            �            1259    17254    ima_usl    TABLE     V   CREATE TABLE public.ima_usl (
    id integer NOT NULL,
    id_usl integer NOT NULL
);
    DROP TABLE public.ima_usl;
       public         heap    postgres    false            �            1259    17229    kafic    TABLE     B  CREATE TABLE public.kafic (
    naziv character varying(100) NOT NULL,
    id integer NOT NULL,
    radno_vr character varying(200) NOT NULL,
    adresa character varying(100) NOT NULL,
    pros_ocjena double precision,
    broj_recenzija integer,
    pet_friendly boolean,
    wifi boolean,
    id_kv integer NOT NULL
);
    DROP TABLE public.kafic;
       public         heap    postgres    false            �            1259    17214    kvart    TABLE     h   CREATE TABLE public.kvart (
    naziv_kv character varying(100) NOT NULL,
    id_kv integer NOT NULL
);
    DROP TABLE public.kvart;
       public         heap    postgres    false            �            1259    17219    specijalna_ponuda    TABLE     v   CREATE TABLE public.specijalna_ponuda (
    naziv_pon character varying(200) NOT NULL,
    id_pon integer NOT NULL
);
 %   DROP TABLE public.specijalna_ponuda;
       public         heap    postgres    false            �            1259    17224    usluga    TABLE     k   CREATE TABLE public.usluga (
    naziv_usl character varying(200) NOT NULL,
    id_usl integer NOT NULL
);
    DROP TABLE public.usluga;
       public         heap    postgres    false            *          0    17239    ima_pon 
   TABLE DATA           -   COPY public.ima_pon (id, id_pon) FROM stdin;
    public          postgres    false    219   Z       +          0    17254    ima_usl 
   TABLE DATA           -   COPY public.ima_usl (id, id_usl) FROM stdin;
    public          postgres    false    220   �       )          0    17229    kafic 
   TABLE DATA           t   COPY public.kafic (naziv, id, radno_vr, adresa, pros_ocjena, broj_recenzija, pet_friendly, wifi, id_kv) FROM stdin;
    public          postgres    false    218   �       &          0    17214    kvart 
   TABLE DATA           0   COPY public.kvart (naziv_kv, id_kv) FROM stdin;
    public          postgres    false    215   �       '          0    17219    specijalna_ponuda 
   TABLE DATA           >   COPY public.specijalna_ponuda (naziv_pon, id_pon) FROM stdin;
    public          postgres    false    216           (          0    17224    usluga 
   TABLE DATA           3   COPY public.usluga (naziv_usl, id_usl) FROM stdin;
    public          postgres    false    217   I        �           2606    17243    ima_pon ima_pon_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.ima_pon
    ADD CONSTRAINT ima_pon_pkey PRIMARY KEY (id, id_pon);
 >   ALTER TABLE ONLY public.ima_pon DROP CONSTRAINT ima_pon_pkey;
       public            postgres    false    219    219            �           2606    17258    ima_usl ima_usl_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.ima_usl
    ADD CONSTRAINT ima_usl_pkey PRIMARY KEY (id, id_usl);
 >   ALTER TABLE ONLY public.ima_usl DROP CONSTRAINT ima_usl_pkey;
       public            postgres    false    220    220            �           2606    17233    kafic kafic_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.kafic
    ADD CONSTRAINT kafic_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.kafic DROP CONSTRAINT kafic_pkey;
       public            postgres    false    218            �           2606    17218    kvart kvart_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.kvart
    ADD CONSTRAINT kvart_pkey PRIMARY KEY (id_kv);
 :   ALTER TABLE ONLY public.kvart DROP CONSTRAINT kvart_pkey;
       public            postgres    false    215            �           2606    17223 (   specijalna_ponuda specijalna_ponuda_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.specijalna_ponuda
    ADD CONSTRAINT specijalna_ponuda_pkey PRIMARY KEY (id_pon);
 R   ALTER TABLE ONLY public.specijalna_ponuda DROP CONSTRAINT specijalna_ponuda_pkey;
       public            postgres    false    216            �           2606    17228    usluga usluga_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.usluga
    ADD CONSTRAINT usluga_pkey PRIMARY KEY (id_usl);
 <   ALTER TABLE ONLY public.usluga DROP CONSTRAINT usluga_pkey;
       public            postgres    false    217            �           2606    17244    ima_pon ima_pon_id_fkey    FK CONSTRAINT     q   ALTER TABLE ONLY public.ima_pon
    ADD CONSTRAINT ima_pon_id_fkey FOREIGN KEY (id) REFERENCES public.kafic(id);
 A   ALTER TABLE ONLY public.ima_pon DROP CONSTRAINT ima_pon_id_fkey;
       public          postgres    false    219    3469    218            �           2606    17249    ima_pon ima_pon_id_pon_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ima_pon
    ADD CONSTRAINT ima_pon_id_pon_fkey FOREIGN KEY (id_pon) REFERENCES public.specijalna_ponuda(id_pon);
 E   ALTER TABLE ONLY public.ima_pon DROP CONSTRAINT ima_pon_id_pon_fkey;
       public          postgres    false    219    216    3465            �           2606    17259    ima_usl ima_usl_id_fkey    FK CONSTRAINT     q   ALTER TABLE ONLY public.ima_usl
    ADD CONSTRAINT ima_usl_id_fkey FOREIGN KEY (id) REFERENCES public.kafic(id);
 A   ALTER TABLE ONLY public.ima_usl DROP CONSTRAINT ima_usl_id_fkey;
       public          postgres    false    3469    220    218            �           2606    17264    ima_usl ima_usl_id_usl_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.ima_usl
    ADD CONSTRAINT ima_usl_id_usl_fkey FOREIGN KEY (id_usl) REFERENCES public.usluga(id_usl);
 E   ALTER TABLE ONLY public.ima_usl DROP CONSTRAINT ima_usl_id_usl_fkey;
       public          postgres    false    3467    220    217            �           2606    17234    kafic kafic_id_kv_fkey    FK CONSTRAINT     v   ALTER TABLE ONLY public.kafic
    ADD CONSTRAINT kafic_id_kv_fkey FOREIGN KEY (id_kv) REFERENCES public.kvart(id_kv);
 @   ALTER TABLE ONLY public.kafic DROP CONSTRAINT kafic_id_kv_fkey;
       public          postgres    false    215    218    3463            *   5   x���4�24�4� 2,��9q�i3 m
Ɔ\&@���@�ؐ+F��� 9�      +   A   x��� !��l17*ڋ��q�dy��B>,u�! u��ŭ�7�x5�IO�줣�a�z��d�      )   �  x�m�Kn�0���S�H���%F�6M� M7E7#��i�����@W=D�ܫc�Ja�����9��ӊz�����	8�?��
��S��%I��g�_�;B��0M ?� M�\x*v+�уV�Bַs F`}>�~�ʝ�ډQ��!,8�E��X;a�Jn��f?�ѵ�r ��h���&HTe�ET�.�x#{���O�/f�'	�_���"^-أ�=(��d�<)�}�G���=�,6R��ٕ��Vc �1�2
d�NB�(� qG�:,��H�DgZ��.�d��9(�Cs����??�~�J�B3��"���L�X�d���S%Þ��p�-Ǿ��,�{
J3�e,S4|ʃt�������|�{�p����#jM��6n������lٮ�US�NuX�7���:g��k�{      &   Y   x�(J=қ��i�utAAb^1�i�囘]���Y�i�T��zt!�	�WbQi�)�KiRQbY"�WpbYfr"�9WXQRb^&�W� ���      '   ,   x����.I���4�*��KU(I,.��K�4�2�6�4����� ش	�      (   3   x��J,)�/J�KT(I-J,N�4��G1��N,KT�JT(K��4����� ?�     