const dotenv = require('dotenv');

dotenv.config();

const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(sinonChai);
chai.use(chaiAsPromised);


const {expect} = chai;

const Article = require('../../models/article');
const Notice = require('../../models/notice');
const exampleNotice = require('./exampleNotices.json');

const articleConst = {
  notice_protocol: exampleNotice.notice.protocol,
  text: 'lo Statuto dell\'Università degli Studi di Salerno; VISTO l\'art. 13 del Regolamento UE 2016/679 - Regolamento Generale sulla Protezione dei Dati;',
  initial: 'VISTO',
};

describe('Article model', function() {
  let article;

  before(async function() {
    article = JSON.parse(JSON.stringify(articleConst));
    exampleNotice.notice.articles = null;

    await Notice.create(exampleNotice.notice);
  });

  after(async function() {
    article = JSON.parse(JSON.stringify(articleConst));

    await Notice.remove(exampleNotice.notice);
  });

  describe('Create method', function() {
    after(async function() {
      await Article.remove(article);
    });

    it('Create_1', function() {
      expect(Article.create(null)).to.have.been.rejectedWith(Error, /null/);
    });

    it('Create_2', async function() {
      article = await Article.create(article);
      expect(true);
    });
  });

  describe('Update method', function() {
    before(async function() {
      article = await Article.create(article);
    });

    it('Update_1', function() {
      expect(Article.update(null)).to.have.been.rejectedWith(Error, /null/);
    });

    it('Update_2', function() {
      const tempArticle = JSON.parse(JSON.stringify(article));

      tempArticle.id = 9999999;

      expect(Article.update(tempArticle)).to.have.been.rejectedWith(Error, /doesn't exists/);
    });

    it('Update_3', function() {
      expect(Article.update(article)).to.have.fulfilled;
    });
  });

  describe('Remove method', function() {
    it('Remove_1', function() {
      expect(Article.remove(null)).to.have.been.rejectedWith(Error, /null/);
    });

    it('Remove_2', function() {
      expect(Article.remove(article)).to.have.fulfilled;
    });
  });

  describe('Exists method', function() {
    it('Exists_1', function() {
      expect(Article.exists(null)).to.have.been.rejectedWith(Error, /null/);
    });

    it('Exists_2', function() {
      expect(Article.exists(article)).to.have.fulfilled;
    });
  });

  describe('FindById method', function() {
    it('FindById_1', function() {
      expect(Article.findById(null, null)).to.have.been.rejectedWith(Error, /null/);
    });

    it('FindById_2', function() {
      expect(Article.findById(article.id, article.notice_protocol)).to.have.fulfilled;
    });
  });

  describe('FindByNotice method', function() {
    it('FindByNotice_1', function() {
      expect(Article.findByNotice(null)).to.have.been.rejectedWith(Error, /null/);
    });

    it('FindByNotice_2', function() {
      expect(Article.findByNotice(article.notice_protocol)).to.have.fulfilled;
    });
  });

  describe('FindAll method', function() {
    it('FindAll_1', function() {
      expect(Article.findAll()).to.have.fulfilled;
    });
  });
});